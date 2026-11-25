package com.authsphere_backend.apikey.dto;


import com.authsphere_backend.apikey.dto.ApiKeyDto;
import com.authsphere_backend.apikey.entity.ApiKey;
import java.time.Instant;
import java.util.UUID;

public record ApiKeyDto(
        UUID id,
        String name,
        String maskedKey,
        String environment,
        String scopes,
        boolean active,
        Instant createdAt,
        Instant expiresAt,
        Instant lastUsedAt,
        String plainTextKey
) {
}
