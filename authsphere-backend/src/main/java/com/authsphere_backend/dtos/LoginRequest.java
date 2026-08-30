package com.authsphere_backend.dtos;

public record LoginRequest(
        String email,
        String password
) {
}
