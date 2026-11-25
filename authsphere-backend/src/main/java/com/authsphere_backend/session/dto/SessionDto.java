package com.authsphere_backend.session.dto;


import com.authsphere_backend.session.dto.SessionDto;
import java.time.Instant;
import java.util.UUID;

public record SessionDto(
        UUID id,
        String deviceName,
        String browser,
        String os,
        String ipAddress,
        String location,
        Instant lastActiveAt,
        Instant createdAt,
        boolean current,
        boolean secure
) {
}
