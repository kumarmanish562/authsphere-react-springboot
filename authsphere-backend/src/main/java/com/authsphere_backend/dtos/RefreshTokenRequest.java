package com.authsphere_backend.dtos;

import com.authsphere_backend.entities.RefreshToken;

import java.util.Optional;

public record RefreshTokenRequest(
        String refreshToken

) {


}