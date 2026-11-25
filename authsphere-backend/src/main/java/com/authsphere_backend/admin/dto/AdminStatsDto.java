package com.authsphere_backend.admin.dto;

import com.authsphere_backend.security.dto.AuditLogDto;

import java.util.List;

public record AdminStatsDto(
        long totalUsers,
        long activeSessions,
        long lockedAccounts,
        List<AuditLogDto> recentAuditLogs
) {
}
