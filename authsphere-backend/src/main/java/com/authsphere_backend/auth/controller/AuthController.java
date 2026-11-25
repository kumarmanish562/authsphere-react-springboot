package com.authsphere_backend.auth.controller;


import com.authsphere_backend.auth.dto.ForgotPasswordRequest;
import com.authsphere_backend.auth.dto.LoginRequest;
import com.authsphere_backend.auth.dto.RefreshTokenRequest;
import com.authsphere_backend.auth.dto.RegisterRequest;
import com.authsphere_backend.auth.dto.ResetPasswordRequest;
import com.authsphere_backend.auth.dto.TokenResponse;
import com.authsphere_backend.auth.dto.VerifyEmailRequest;
import com.authsphere_backend.auth.entity.TwoFactorBackupCode;
import com.authsphere_backend.auth.entity.VerificationToken;
import com.authsphere_backend.auth.repository.TwoFactorBackupCodeRepository;
import com.authsphere_backend.auth.repository.VerificationTokenRepository;
import com.authsphere_backend.auth.security.TotpService;
import com.authsphere_backend.common.service.EmailService;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.auth.security.CookieService;
import com.authsphere_backend.auth.security.JwtService;
import com.authsphere_backend.auth.entity.RefreshToken;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.auth.repository.RefreshTokenRepository;
import com.authsphere_backend.user.repository.UserRepository;
import com.authsphere_backend.security.service.AuditLogService;
import com.authsphere_backend.auth.service.AuthService;
import com.authsphere_backend.session.service.SessionService;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


import java.time.Instant;
import java.time.temporal.ChronoUnit;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/api/m1/auth")
@RequiredArgsConstructor
public class AuthController {


    private final AuthService authService;

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final ModelMapper modelMapper;

    private final RefreshTokenRepository refreshTokenRepository;

    private final CookieService cookieService;

    private final SessionService sessionService;

    private final AuditLogService auditLogService;

    private final VerificationTokenRepository verificationTokenRepository;

    private final EmailService emailService;

    private final TotpService totpService;

    private final TwoFactorBackupCodeRepository backupCodeRepository;

    private final PasswordEncoder passwordEncoder;


    // ==========================================================
    // REGISTER
    // ==========================================================

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        authService.registerUser(request)
                );
    }


    @PostMapping("/refresh")
    @Transactional
    public ResponseEntity<TokenResponse> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest body,
            HttpServletResponse response,
            HttpServletRequest request
    ) {

        // ==========================================================
        // 1. READ REFRESH TOKEN
        // ==========================================================

        String refreshToken =
                readRefreshTokenFromRequest(body, request)
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Refresh token missing"
                                )
                        );


        // ==========================================================
        // 2. CHECK REFRESH TOKEN TYPE
        // ==========================================================

        if (!jwtService.isRefreshToken(refreshToken)) {

            throw new BadCredentialsException(
                    "Invalid refresh token type"
            );
        }


        // ==========================================================
        // 3. GET JTI FROM JWT
        // ==========================================================

        String jti =
                jwtService.getJti(refreshToken);


        // ==========================================================
        // 4. GET USER ID FROM JWT
        // ==========================================================

        UUID userId =
                jwtService.getUserId(refreshToken);


        // ==========================================================
        // 5. FIND TOKEN IN DATABASE
        // ==========================================================

        RefreshToken storedRefreshToken =
                refreshTokenRepository
                        .findByJti(jti)
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Invalid refresh token"
                                )
                        );


        // ==========================================================
        // 6. CHECK TOKEN REVOCATION
        // ==========================================================

        if (storedRefreshToken.isRevoked()) {

            throw new BadCredentialsException(
                    "Refresh token has been revoked"
            );
        }


        // ==========================================================
        // 7. CHECK DATABASE EXPIRATION
        // ==========================================================

        if (storedRefreshToken
                .getExpiresAt()
                .isBefore(Instant.now())) {

            throw new BadCredentialsException(
                    "Refresh token has expired"
            );
        }


        // ==========================================================
        // 8. CHECK USER OWNERSHIP
        // ==========================================================

        if (!storedRefreshToken
                .getUser()
                .getId()
                .equals(userId)) {

            throw new BadCredentialsException(
                    "Refresh token does not belong to this user"
            );
        }


        // ==========================================================
        // 9. GET USER
        // ==========================================================

        User user =
                storedRefreshToken.getUser();


        // ==========================================================
        // 10. ROTATE OLD REFRESH TOKEN
        // ==========================================================

        String newJti =
                UUID.randomUUID().toString();

        storedRefreshToken.setRevoked(true);

        storedRefreshToken.setReplacedByToken(
                newJti
        );

        refreshTokenRepository.save(
                storedRefreshToken
        );


        // ==========================================================
        // 11. CREATE NEW REFRESH TOKEN DATABASE RECORD
        // ==========================================================

        Instant now =
                Instant.now();

        RefreshToken newRefreshTokenEntity =
                RefreshToken.builder()
                        .jti(newJti)
                        .user(user)
                        .createdAt(now)
                        .expiresAt(
                                now.plusSeconds(
                                        jwtService.getRefreshTtlSeconds()
                                )
                        )
                        .revoked(false)
                        .build();

        refreshTokenRepository.save(
                newRefreshTokenEntity
        );

        sessionService.rotateSessionJti(
                jti,
                newJti,
                newRefreshTokenEntity.getExpiresAt(),
                request
        );

        auditLogService.log(
                user,
                "TOKEN_REFRESH",
                "Refreshed access session token",
                "SUCCESS",
                request
        );


        // ==========================================================
        // 12. GENERATE NEW ACCESS TOKEN
        // ==========================================================

        String newAccessToken =
                jwtService.generateAccessToken(user);


        // ==========================================================
        // 13. GENERATE NEW REFRESH TOKEN JWT
        // ==========================================================

        String newRefreshToken =
                jwtService.generateRefreshToken(
                        user,
                        newJti
                );


        // ==========================================================
        // 14. REPLACE REFRESH TOKEN COOKIE
        // ==========================================================

        cookieService.attachRefreshCookie(
                response,
                newRefreshToken,
                jwtService.getRefreshTtlSeconds()
        );


        // ==========================================================
        // 15. PREVENT CACHING
        // ==========================================================

        cookieService.addNoStoreHeaders(
                response
        );


        // ==========================================================
        // 16. RETURN RESPONSE
        // ==========================================================

        return ResponseEntity.ok(
                TokenResponse.of(
                        newAccessToken,
                        newRefreshToken,
                        jwtService.getAccessTtlSeconds(),
                        modelMapper.map(
                                user,
                                UserDto.class
                        )
                )
        );
    }

    private Optional<String> readRefreshTokenFromRequest(
            RefreshTokenRequest body,
            HttpServletRequest request
    ) {

        // ==========================================================
        // 1. COOKIE
        // ==========================================================

        if (request.getCookies() != null) {

            Optional<String> fromCookie =
                    Arrays.stream(request.getCookies())
                            .filter(cookie ->
                                    cookieService
                                            .getRefreshTokenCookieName()
                                            .equals(cookie.getName())
                            )
                            .map(Cookie::getValue)
                            .filter(value ->
                                    value != null &&
                                            !value.isBlank()
                            )
                            .findFirst();

            if (fromCookie.isPresent()) {
                return fromCookie;
            }
        }


        // ==========================================================
        // 2. REQUEST BODY
        // ==========================================================

        if (body != null &&
                body.refreshToken() != null &&
                !body.refreshToken().isBlank()) {

            return Optional.of(
                    body.refreshToken().trim()
            );
        }


        // ==========================================================
        // 3. X-Refresh-Token HEADER
        // ==========================================================

        String refreshHeader =
                request.getHeader("X-Refresh-Token");

        if (refreshHeader != null &&
                !refreshHeader.isBlank()) {

            return Optional.of(
                    refreshHeader.trim()
            );
        }


        // ==========================================================
        // 4. AUTHORIZATION HEADER
        // ==========================================================

        String authorizationHeader =
                request.getHeader(
                        HttpHeaders.AUTHORIZATION
                );

        if (authorizationHeader != null &&
                authorizationHeader.regionMatches(
                        true,
                        0,
                        "Bearer ",
                        0,
                        7
                )) {

            String candidate =
                    authorizationHeader
                            .substring(7)
                            .trim();

            if (!candidate.isEmpty()) {
                return Optional.of(candidate);
            }
        }


        // ==========================================================
        // 5. TOKEN NOT FOUND
        // ==========================================================

        return Optional.empty();
    }




// ==========================================================
// LOGOUT
// ==========================================================

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        // ==========================================================
        // 1. READ REFRESH TOKEN
        // ==========================================================

        Optional<String> refreshToken =
                readRefreshTokenFromRequest(
                        null,
                        request
                );


        // ==========================================================
        // 2. REVOKE REFRESH TOKEN
        // ==========================================================

        refreshToken.ifPresent(token -> {

            try {

                // Check token type
                if (jwtService.isRefreshToken(token)) {

                    // Extract JTI
                    String jti =
                            jwtService.getJti(token);

                    // Find token in database
                    refreshTokenRepository
                            .findByJti(jti)
                            .ifPresent(storedToken -> {

                                // Revoke token
                                storedToken.setRevoked(true);

                                refreshTokenRepository.save(
                                        storedToken
                                );

                                sessionService.deactivateSessionByJti(jti);

                                auditLogService.log(
                                        storedToken.getUser(),
                                        "LOGOUT",
                                        "Signed out of active session",
                                        "SUCCESS",
                                        request
                                );
                            });
                }

            } catch (JwtException e) {

                // Token is invalid/expired/malformed.
                // Cookie will still be cleared below.

            } catch (Exception e) {

                // Do not prevent cookie cleanup
                // because of an unexpected database error.
            }
        });


        // ==========================================================
        // 3. CLEAR REFRESH TOKEN COOKIE
        // ==========================================================

        cookieService.clearRefreshCookie(
                response
        );


        // ==========================================================
        // 4. PREVENT CACHING
        // ==========================================================

        cookieService.addNoStoreHeaders(
                response
        );


        // ==========================================================
        // 5. CLEAR SECURITY CONTEXT
        // ==========================================================

        SecurityContextHolder.clearContext();


        // ==========================================================
        // 6. RETURN 204 NO CONTENT
        // ==========================================================

        return ResponseEntity
                .noContent()
                .build();
    }


    // ==========================================================
    // LOGIN
    // ==========================================================

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User user = userRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!user.isAccountNonLocked()) {
            throw new LockedException("Account is temporarily locked due to multiple failed login attempts. Try again later.");
        }

        try {
            authenticate(loginRequest);
        } catch (BadCredentialsException e) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            if (attempts >= 5) {
                user.setLockUntil(Instant.now().plus(15, ChronoUnit.MINUTES));
                auditLogService.log(user, "ACCOUNT_LOCKED", "Account locked for 15 minutes after 5 failed login attempts", "FAILURE", request);
            } else {
                auditLogService.log(user, "LOGIN_FAILED", "Failed login attempt (" + attempts + "/5)", "FAILURE", request);
            }
            userRepository.save(user);
            throw e;
        }

        if (!user.isEnabled()) {
            throw new DisabledException("User is disabled");
        }

        if (user.isTwoFactorEnabled()) {
            if (loginRequest.otpCode() == null || loginRequest.otpCode().isBlank()) {
                throw new BadCredentialsException("2FA_REQUIRED");
            }
            String submittedCode = loginRequest.otpCode().trim().toUpperCase();
            boolean validTotp = totpService.verifyCode(user.getTotpSecret(), submittedCode);
            boolean validBackup = false;

            if (!validTotp) {
                for (TwoFactorBackupCode bc : backupCodeRepository.findByUserIdAndUsedFalse(user.getId())) {
                    if (passwordEncoder.matches(submittedCode, bc.getCodeHash())) {
                        bc.setUsed(true);
                        backupCodeRepository.save(bc);
                        validBackup = true;
                        auditLogService.log(user, "BACKUP_CODE_USED", "Signed in using a 2FA backup recovery code", "WARNING", request);
                        break;
                    }
                }
            }

            if (!validTotp && !validBackup) {
                auditLogService.log(user, "LOGIN_FAILED", "Invalid 2FA verification code", "FAILURE", request);
                throw new BadCredentialsException("Invalid 2FA verification code");
            }
        }

        if (user.getFailedLoginAttempts() > 0 || user.getLockUntil() != null) {
            user.setFailedLoginAttempts(0);
            user.setLockUntil(null);
            userRepository.save(user);
        }


        // ======================================================
        // 4. CREATE UNIQUE JTI
        // ======================================================

        String jti =
                UUID.randomUUID().toString();


        // ======================================================
        // 5. CREATE DATABASE REFRESH TOKEN RECORD
        // ======================================================

        Instant now =
                Instant.now();


        RefreshToken refreshTokenEntity =
                RefreshToken.builder()
                        .jti(jti)
                        .user(user)
                        .createdAt(now)
                        .expiresAt(
                                now.plusSeconds(
                                        jwtService
                                                .getRefreshTtlSeconds()
                                )
                        )
                        .revoked(false)
                        .build();


        refreshTokenRepository.save(
                refreshTokenEntity
        );

        sessionService.createSession(
                user,
                jti,
                refreshTokenEntity.getExpiresAt(),
                request
        );

        auditLogService.log(
                user,
                "LOGIN",
                "Signed in with email and password",
                "SUCCESS",
                request
        );


        // ======================================================
        // 6. GENERATE ACCESS TOKEN
        // ======================================================

        String accessToken =
                jwtService.generateAccessToken(
                        user
                );


        // ======================================================
        // 7. GENERATE REFRESH TOKEN
        // ======================================================

        String refreshToken =
                jwtService.generateRefreshToken(
                        user,
                        jti
                );


        // ======================================================
        // 8. PUT REFRESH TOKEN INTO HTTP-ONLY COOKIE
        // ======================================================

        cookieService.attachRefreshCookie(
                response,
                refreshToken,
                jwtService.getRefreshTtlSeconds()
        );


        // ======================================================
        // 9. PREVENT CACHING
        // ======================================================

        cookieService.addNoStoreHeaders(
                response
        );


        // ======================================================
        // 10. CREATE RESPONSE
        // ======================================================

        TokenResponse tokenResponse =
                TokenResponse.of(
                        accessToken,
                        refreshToken,
                        jwtService.getAccessTtlSeconds(),
                        modelMapper.map(
                                user,
                                UserDto.class
                        )
                );


        // ======================================================
        // 11. RETURN RESPONSE
        // ======================================================

        return ResponseEntity.ok(
                tokenResponse
        );
    }


    // ==========================================================
    // AUTHENTICATE
    // ==========================================================

    private Authentication authenticate(
            LoginRequest loginRequest
    ) {

        try {

            return authenticationManager.authenticate(

                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );

        } catch (Exception e) {

            throw new BadCredentialsException(
                    "Invalid username or password"
            );
        }
    }

    // ==========================================================
    // FORGOT PASSWORD & RESET PASSWORD
    // ==========================================================

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest body,
            HttpServletRequest request
    ) {
        userRepository.findByEmail(body.email().trim()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            verificationTokenRepository.save(VerificationToken.builder()
                    .token(token)
                    .type(VerificationToken.TokenType.PASSWORD_RESET)
                    .user(user)
                    .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                    .build());
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
            auditLogService.log(user, "PASSWORD_RESET_REQUESTED", "Requested password reset link", "SUCCESS", request);
        });

        return ResponseEntity.ok(Map.of(
                "message", "If an account exists with this email, a password reset link has been sent."
        ));
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest body,
            HttpServletRequest request
    ) {
        VerificationToken vToken = verificationTokenRepository
                .findByTokenAndType(body.token().trim(), VerificationToken.TokenType.PASSWORD_RESET)
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired reset token"));

        if (vToken.isUsed() || vToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Reset token has expired or already been used");
        }

        User user = vToken.getUser();
        user.setPassword(passwordEncoder.encode(body.newPassword()));
        user.setFailedLoginAttempts(0);
        user.setLockUntil(null);
        userRepository.save(user);

        vToken.setUsed(true);
        verificationTokenRepository.save(vToken);

        auditLogService.log(user, "PASSWORD_RESET", "Password reset successfully via email token", "SUCCESS", request);

        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully."));
    }

    // ==========================================================
    // EMAIL VERIFICATION
    // ==========================================================

    @PostMapping("/verify-email")
    @Transactional
    public ResponseEntity<Map<String, String>> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest body,
            HttpServletRequest request
    ) {
        VerificationToken vToken = verificationTokenRepository
                .findByTokenAndType(body.token().trim(), VerificationToken.TokenType.EMAIL_VERIFY)
                .orElseThrow(() -> new BadCredentialsException("Invalid verification token"));

        if (vToken.isUsed() || vToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Verification token has expired or already been used");
        }

        User user = vToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        vToken.setUsed(true);
        verificationTokenRepository.save(vToken);

        auditLogService.log(user, "EMAIL_VERIFIED", "Verified primary email address", "SUCCESS", request);

        return ResponseEntity.ok(Map.of("message", "Email verified successfully."));
    }

    @PostMapping("/resend-verification")
    @Transactional
    public ResponseEntity<Map<String, String>> resendVerification(
            @Valid @RequestBody ForgotPasswordRequest body
    ) {
        userRepository.findByEmail(body.email().trim()).ifPresent(user -> {
            if (!user.isEmailVerified()) {
                String token = UUID.randomUUID().toString();
                verificationTokenRepository.save(VerificationToken.builder()
                        .token(token)
                        .type(VerificationToken.TokenType.EMAIL_VERIFY)
                        .user(user)
                        .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                        .build());
                emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
            }
        });

        return ResponseEntity.ok(Map.of("message", "Verification email sent if account is unverified."));
    }

}