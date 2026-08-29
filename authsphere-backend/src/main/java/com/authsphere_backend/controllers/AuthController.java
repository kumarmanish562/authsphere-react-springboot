package com.authsphere_backend.controllers;

import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/m1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


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
}