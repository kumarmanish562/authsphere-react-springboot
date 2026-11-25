package com.authsphere_backend.security.service;


import com.authsphere_backend.security.repository.AuditLogRepository;
import com.authsphere_backend.security.service.SecurityServiceImpl;
import com.authsphere_backend.security.dto.AuditLogDto;
import com.authsphere_backend.security.dto.SecurityOverviewDto;
import com.authsphere_backend.security.dto.SecurityOverviewDto.AuthMethodDto;
import com.authsphere_backend.security.dto.SecurityOverviewDto.SecurityRequirementDto;
import com.authsphere_backend.user.entity.Provider;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.session.entity.UserSession;
import com.authsphere_backend.common.exceptions.ResourceNotFoundException;
import com.authsphere_backend.user.repository.UserRepository;
import com.authsphere_backend.session.repository.UserSessionRepository;
import com.authsphere_backend.security.service.AuditLogService;
import com.authsphere_backend.security.service.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SecurityServiceImpl implements SecurityService {

    private final UserRepository userRepository;
    private final UserSessionRepository sessionRepository;
    private final AuditLogService auditLogService;
    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public SecurityOverviewDto getSecurityOverview(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean emailVerified = user.isEmailVerified() || user.getProvider() != Provider.LOCAL;
        boolean hasStrongPassword = user.getPassword() != null && !user.getPassword().isBlank();
        boolean twoFactorEnabled = user.isTwoFactorEnabled();

        long suspiciousCount = auditLogRepository.countByUserIdAndStatusAndCreatedAtAfter(
                userId, "FAILURE", Instant.now().minus(30, ChronoUnit.DAYS)
        );
        boolean noSuspiciousLogins = suspiciousCount == 0;

        int score = 0;
        if (emailVerified) score += 25;
        if (hasStrongPassword || user.getProvider() != Provider.LOCAL) score += 25;
        if (twoFactorEnabled) score += 30;
        if (noSuspiciousLogins) score += 20;

        List<SecurityRequirementDto> requirements = List.of(
                new SecurityRequirementDto(
                        "email_verified",
                        "Email verification",
                        emailVerified ? "Your primary email address is verified." : "Verify your primary email address.",
                        emailVerified,
                        25
                ),
                new SecurityRequirementDto(
                        "strong_password",
                        "Strong password",
                        hasStrongPassword ? "Your account is protected with an encrypted password." : "OAuth-managed credentials.",
                        hasStrongPassword || user.getProvider() != Provider.LOCAL,
                        25
                ),
                new SecurityRequirementDto(
                        "two_factor",
                        "Two-factor authentication",
                        twoFactorEnabled ? "2FA is active on your account." : "Add another layer of protection to your account.",
                        twoFactorEnabled,
                        30
                ),
                new SecurityRequirementDto(
                        "no_suspicious_activity",
                        "Clean login history",
                        noSuspiciousLogins ? "No suspicious login attempts in the past 30 days." : suspiciousCount + " failed login attempt(s) detected.",
                        noSuspiciousLogins,
                        20
                )
        );

        List<AuthMethodDto> authMethods = List.of(
                new AuthMethodDto(
                        "password",
                        "Password",
                        "Primary authentication method",
                        hasStrongPassword ? "Active" : "Not configured",
                        hasStrongPassword
                ),
                new AuthMethodDto(
                        "google",
                        "Google",
                        "OAuth 2.0 authentication",
                        user.getProvider() == Provider.GOOGLE ? "Connected" : "Available",
                        user.getProvider() == Provider.GOOGLE
                ),
                new AuthMethodDto(
                        "github",
                        "GitHub",
                        "OAuth 2.0 authentication",
                        user.getProvider() == Provider.GITHUB ? "Connected" : "Available",
                        user.getProvider() == Provider.GITHUB
                )
        );

        Instant now = Instant.now();
        long activeSessions = sessionRepository.findByUserIdAndActiveTrueOrderByLastActiveAtDesc(userId)
                .stream()
                .filter(s -> s.getExpiresAt().isAfter(now))
                .count();

        List<AuditLogDto> recentActivity = auditLogService.getRecentLogs(userId);

        return new SecurityOverviewDto(
                score,
                activeSessions,
                "Online",
                emailVerified,
                twoFactorEnabled,
                requirements,
                authMethods,
                recentActivity
        );
    }
}
