package com.authsphere_backend.apikey.dto;


import com.authsphere_backend.apikey.dto.CreateApiKeyRequest;
import com.authsphere_backend.apikey.entity.ApiKey;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateApiKeyRequest(
        @NotBlank(message = "API key name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name,

        String environment,

        String scopes,

        Integer expiresInDays
) {
}
