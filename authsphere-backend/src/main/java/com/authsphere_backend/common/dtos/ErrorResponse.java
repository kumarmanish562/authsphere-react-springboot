package com.authsphere_backend.common.dtos;


import com.authsphere_backend.common.dtos.ErrorResponse;
import org.springframework.http.HttpStatus;

public record ErrorResponse(
        String message,
        HttpStatus status,
        int statusCode
) {
}