package com.authsphere_backend.controllers;

import com.authsphere_backend.Security.JwtService;
import com.authsphere_backend.dtos.LoginRequest;
import com.authsphere_backend.dtos.TokenResponse;
import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.entities.User;
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

@RestController
@RequestMapping("/api/m1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final AuthenticationManager authenticationManager;

    private final UserRepository  userRepository;

    private final JwtService jwtService;
    private final ModelMapper modelMapper;


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

    // ==========================================
    // Login USER API
    // POST /api/m1/auth/register
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
            @RequestBody LoginRequest loginRequest
    ) {

        // Authenticate username and password
        Authentication authenticate =
                authenticate(loginRequest);

        // Find user
        User user = userRepository
                .findByEmail(loginRequest.email())
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid Username and Password"
                        )
                );

        // Check whether user is disabled
        if (!user.isEnable()) {
            throw new DisabledException("User is Disable");
        }

        // Generate access token
        String accessToken =
                jwtService.generateAccessToken(user);

        // Create token response
        TokenResponse tokenResponse =
                TokenResponse.of(
                        accessToken,
                        "",
                        jwtService.getAccessTtlSeconds(),
                        modelMapper.map(user, UserDto.class)
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