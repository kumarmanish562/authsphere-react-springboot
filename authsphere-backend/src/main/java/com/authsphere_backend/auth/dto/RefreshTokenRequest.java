package com.authsphere_backend.auth.dto;


import com.authsphere_backend.auth.dto.RefreshTokenRequest;
import com.authsphere_backend.auth.entity.RefreshToken;

import java.util.Optional;

public record RefreshTokenRequest(
        String refreshToken

) {


}