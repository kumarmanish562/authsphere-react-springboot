package com.authsphere_backend.controllers;

import com.authsphere_backend.Security.CookieService;
import com.authsphere_backend.Security.JwtService;
import com.authsphere_backend.dtos.LoginRequest;
import com.authsphere_backend.dtos.TokenResponse;
import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.entities.RefreshToken;
import com.authsphere_backend.entities.User;
import com.authsphere_backend.repositories.RefreshTokenRepository;
import com.authsphere_backend.repositories.UserRepository;
import com.authsphere_backend.services.AuthService;

import jakarta.servlet.http.HttpServletResponse;

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

import java.time.Instant;
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