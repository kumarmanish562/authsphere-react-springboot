package com.authsphere_backend.security.dto;


import com.authsphere_backend.security.dto.AuditLogDto;
import java.time.Instant;
import java.util.UUID;

public record AuditLogDto(
        UUID id,
        String action,
        String description,
        String status,
        String ipAddress,
        Instant createdAt
) {
}
