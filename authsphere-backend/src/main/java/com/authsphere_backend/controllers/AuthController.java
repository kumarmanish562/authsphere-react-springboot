package com.authsphere_backend.controllers;

import com.authsphere_backend.Security.CookieService;
import com.authsphere_backend.Security.JwtService;
import com.authsphere_backend.dtos.LoginRequest;
import com.authsphere_backend.dtos.RefreshTokenRequest;
import com.authsphere_backend.dtos.TokenResponse;
import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.entities.RefreshToken;
import com.authsphere_backend.entities.User;
import com.authsphere_backend.repositories.RefreshTokenRepository;
import com.authsphere_backend.repositories.UserRepository;
import com.authsphere_backend.services.AuthService;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
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


    // ==========================================================
    // REGISTER
    // ==========================================================

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(
            @RequestBody UserDto userDto
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        authService.registerUser(userDto)
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
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response
    ) {


        // ======================================================
        // 1. AUTHENTICATE USER
        // ======================================================

        authenticate(loginRequest);


        // ======================================================
        // 2. FIND USER
        // ======================================================

        User user =
                userRepository
                        .findByEmail(
                                loginRequest.email()
                        )
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Invalid username or password"
                                )
                        );


        // ======================================================
        // 3. CHECK USER ENABLED
        // ======================================================

        if (!user.isEnable()) {

            throw new DisabledException(
                    "User is disabled"
            );
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



}