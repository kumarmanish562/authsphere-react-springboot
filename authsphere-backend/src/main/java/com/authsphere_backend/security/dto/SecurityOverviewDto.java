package com.authsphere_backend.security.dto;


import com.authsphere_backend.security.dto.AuditLogDto;
import com.authsphere_backend.security.dto.SecurityOverviewDto;
import java.util.List;

public record SecurityOverviewDto(
        int securityScore,
        long activeSessionsCount,
        String apiStatus,
        boolean emailVerified,
        boolean twoFactorEnabled,
        List<SecurityRequirementDto> requirements,
        List<AuthMethodDto> authMethods,
        List<AuditLogDto> recentActivity
) {
    public record SecurityRequirementDto(
            String key,
            String title,
            String description,
            boolean completed,
            int points
    ) {}

    public record AuthMethodDto(
            String key,
            String title,
            String description,
            String status,
            boolean active
    ) {}
}
