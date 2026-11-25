package com.authsphere_backend.session.service;


import com.authsphere_backend.session.service.SessionService;
import com.authsphere_backend.session.dto.SessionDto;
import com.authsphere_backend.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface SessionService {

    void createSession(User user, String jti, Instant expiresAt, HttpServletRequest request);

    void rotateSessionJti(String oldJti, String newJti, Instant newExpiresAt, HttpServletRequest request);

    void deactivateSessionByJti(String jti);

    List<SessionDto> getActiveSessions(UUID userId, String currentJti);

    void revokeSession(UUID userId, UUID sessionId, HttpServletRequest request);

    void revokeOtherSessions(UUID userId, String currentJti, HttpServletRequest request);
}
