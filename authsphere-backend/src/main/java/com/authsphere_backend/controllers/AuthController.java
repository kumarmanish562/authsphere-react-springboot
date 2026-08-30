package com.authsphere_backend.controllers;

import com.authsphere_backend.Security.JwtService;
import com.authsphere_backend.dtos.LoginRequest;
import com.authsphere_backend.dtos.TokenResponse;
import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.entities.RefreshToken;
import com.authsphere_backend.entities.User;
import com.authsphere_backend.repositories.RefreshTokenRepository;
import com.authsphere_backend.repositories.UserRepository;
import com.authsphere_backend.services.AuthService;
import io.jsonwebtoken.Jwt;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.Ref;
import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/m1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final AuthenticationManager authenticationManager;

    private final UserRepository  userRepository;

    private final JwtService jwtService;
    private final ModelMapper modelMapper;

    private final RefreshTokenRepository refreshTokenRepository;


    // ==========================================
    // REGISTER USER API
    // POST /api/m1/auth/register
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(
            @RequestBody UserDto userDto
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.registerUser(userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
            @RequestBody LoginRequest loginRequest
    ) {

        // 1. Authenticate email + password
        authenticate(loginRequest);

        // 2. Find user
        User user = userRepository
                .findByEmail(loginRequest.email())
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid username or password"
                        )
                );

        // 3. Check whether user is enabled
        if (!user.isEnable()) {
            throw new DisabledException("User is disabled");
        }

        // ==========================================================
        // CREATE REFRESH TOKEN JTI
        // ==========================================================

        String jti = UUID.randomUUID().toString();

        // ==========================================================
        // SAVE REFRESH TOKEN INFORMATION IN DATABASE
        // ==========================================================

        Instant now = Instant.now();

        RefreshToken refreshTokenEntity =
                RefreshToken.builder()
                        .jti(jti)
                        .user(user)
                        .createdAt(now)
                        .expiresAt(
                                now.plusSeconds(
                                        jwtService.getRefreshTtlSeconds()
                                )
                        )
                        .revoked(false)
                        .build();

        refreshTokenRepository.save(refreshTokenEntity);

        // ==========================================================
        // GENERATE ACCESS TOKEN
        // ==========================================================

        String accessToken =
                jwtService.generateAccessToken(user);

        // ==========================================================
        // GENERATE REFRESH TOKEN
        // ==========================================================

        String refreshToken =
                jwtService.generateRefreshToken(
                        user,
                        jti
                );

        // ==========================================================
        // CREATE RESPONSE
        // ==========================================================

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

        return ResponseEntity.ok(tokenResponse);
    }


    private Authentication authenticate(LoginRequest loginRequest) {
        try {

            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );

        } catch (Exception e) {

            throw new BadCredentialsException(
                    "Invalid Username or password "
            );
        }
    }
}