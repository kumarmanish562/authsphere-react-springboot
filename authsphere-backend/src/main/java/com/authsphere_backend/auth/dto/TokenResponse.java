package com.authsphere_backend.auth.dto;


import com.authsphere_backend.auth.dto.TokenResponse;
import com.authsphere_backend.auth.entity.RefreshToken;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.dto.UserDto;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        long expiresIn,
        String tokenType,
        UserDto user
) {

    public static TokenResponse of(String accessToken, String refreshToken, long expiresIn, UserDto user){
        return new TokenResponse(accessToken, refreshToken, expiresIn, "Bearer", user);
    }
}
