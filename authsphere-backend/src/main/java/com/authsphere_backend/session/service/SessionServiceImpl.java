package com.authsphere_backend.session.service;


import com.authsphere_backend.session.service.SessionServiceImpl;
import com.authsphere_backend.session.dto.SessionDto;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.session.entity.UserSession;
import com.authsphere_backend.common.exceptions.ResourceNotFoundException;
import com.authsphere_backend.common.helpers.RequestMetadataHelper;
import com.authsphere_backend.auth.repository.RefreshTokenRepository;
import com.authsphere_backend.user.repository.UserRepository;
import com.authsphere_backend.session.repository.UserSessionRepository;
import com.authsphere_backend.security.service.AuditLogService;
import com.authsphere_backend.session.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {

    private final UserSessionRepository sessionRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public void createSession(User user, String jti, Instant expiresAt, HttpServletRequest request) {
        String ip = RequestMetadataHelper.extractClientIp(request);
        String ua = RequestMetadataHelper.extractUserAgent(request);

        UserSession session = UserSession.builder()
                .user(user)
                .jti(jti)
                .ipAddress(ip)
                .userAgent(ua)
                .deviceName(RequestMetadataHelper.parseDeviceName(ua))
                .browser(RequestMetadataHelper.parseBrowser(ua))
                .os(RequestMetadataHelper.parseOs(ua))
                .location(RequestMetadataHelper.resolveLocation(request, ip))
                .active(true)
                .secure(RequestMetadataHelper.isSecureRequest(request, ip))
                .createdAt(Instant.now())
                .lastActiveAt(Instant.now())
                .expiresAt(expiresAt)
                .build();

        sessionRepository.save(session);
    }

    @Override
    @Transactional
    public void rotateSessionJti(String oldJti, String newJti, Instant newExpiresAt, HttpServletRequest request) {
        sessionRepository.findByJti(oldJti).ifPresent(session -> {
            session.setJti(newJti);
            session.setLastActiveAt(Instant.now());
            session.setExpiresAt(newExpiresAt);
            if (request != null) {
                String ip = RequestMetadataHelper.extractClientIp(request);
                session.setIpAddress(ip);
                session.setLocation(RequestMetadataHelper.resolveLocation(request, ip));
            }
            sessionRepository.save(session);
        });
    }

    @Override
    @Transactional
    public void deactivateSessionByJti(String jti) {
        sessionRepository.findByJti(jti).ifPresent(session -> {
            session.setActive(false);
            sessionRepository.save(session);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionDto> getActiveSessions(UUID userId, String currentJti) {
        Instant now = Instant.now();
        return sessionRepository.findByUserIdAndActiveTrueOrderByLastActiveAtDesc(userId)
                .stream()
                .filter(s -> s.getExpiresAt().isAfter(now))
                .map(s -> new SessionDto(
                        s.getId(),
                        s.getDeviceName(),
                        s.getBrowser(),
                        s.getOs(),
                        s.getIpAddress(),
                        s.getLocation(),
                        s.getLastActiveAt(),
                        s.getCreatedAt(),
                        currentJti != null && currentJti.equals(s.getJti()),
                        s.isSecure()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void revokeSession(UUID userId, UUID sessionId, HttpServletRequest request) {
        UserSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        session.setActive(false);
        sessionRepository.save(session);

        refreshTokenRepository.findByJti(session.getJti()).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });

        userRepository.findById(userId).ifPresent(user ->
                auditLogService.log(user, "SESSION_REVOKED",
                        "Revoked session on " + session.getDeviceName() + " (" + session.getBrowser() + ")",
                        "WARNING", request)
        );
    }

    @Override
    @Transactional
    public void revokeOtherSessions(UUID userId, String currentJti, HttpServletRequest request) {
        List<UserSession> activeSessions = sessionRepository.findByUserIdAndActiveTrueOrderByLastActiveAtDesc(userId);
        for (UserSession session : activeSessions) {
            if (currentJti == null || !currentJti.equals(session.getJti())) {
                session.setActive(false);
                sessionRepository.save(session);
                refreshTokenRepository.findByJti(session.getJti()).ifPresent(rt -> {
                    rt.setRevoked(true);
                    refreshTokenRepository.save(rt);
                });
            }
        }

        userRepository.findById(userId).ifPresent(user ->
                auditLogService.log(user, "SESSIONS_REVOKED_ALL",
                        "Revoked all other active sessions",
                        "WARNING", request)
        );
    }
}
