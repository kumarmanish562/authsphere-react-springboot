package com.authsphere_backend.session.controller;


import com.authsphere_backend.session.controller.SessionController;
import com.authsphere_backend.auth.security.CookieService;
import com.authsphere_backend.auth.security.JwtService;
import com.authsphere_backend.session.dto.SessionDto;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.session.service.SessionService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/m1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final CookieService cookieService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<SessionDto>> getActiveSessions(
            @AuthenticationPrincipal User user,
            HttpServletRequest request
    ) {
        String currentJti = extractCurrentJti(request);
        return ResponseEntity.ok(sessionService.getActiveSessions(user.getId(), currentJti));
    }

    @DeleteMapping("/other")
    public ResponseEntity<Void> revokeOtherSessions(
            @AuthenticationPrincipal User user,
            HttpServletRequest request
    ) {
        String currentJti = extractCurrentJti(request);
        sessionService.revokeOtherSessions(user.getId(), currentJti, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> revokeSession(
            @AuthenticationPrincipal User user,
            @PathVariable UUID sessionId,
            HttpServletRequest request
    ) {
        sessionService.revokeSession(user.getId(), sessionId, request);
        return ResponseEntity.noContent().build();
    }

    private String extractCurrentJti(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> cookieService.getRefreshTokenCookieName().equals(c.getName()))
                .map(Cookie::getValue)
                .filter(v -> v != null && !v.isBlank())
                .findFirst()
                .map(token -> {
                    try {
                        return jwtService.isRefreshToken(token) ? jwtService.getJti(token) : null;
                    } catch (Exception e) {
                        return null;
                    }
                })
                .orElse(null);
    }
}
