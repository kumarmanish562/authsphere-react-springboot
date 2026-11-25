package com.authsphere_backend.common.scheduler;

import com.authsphere_backend.auth.repository.RefreshTokenRepository;
import com.authsphere_backend.auth.repository.VerificationTokenRepository;
import com.authsphere_backend.session.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class TokenCleanupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(TokenCleanupScheduler.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final UserSessionRepository userSessionRepository;

    @Scheduled(fixedRate = 3600000) // Every 1 hour
    @Transactional
    public void cleanupExpiredTokensAndSessions() {
        Instant now = Instant.now();
        Instant sessionCutoff = now.minus(7, ChronoUnit.DAYS);

        long deletedRefresh = refreshTokenRepository.deleteByExpiresAtBeforeOrRevokedTrue(now);
        long deletedVerification = verificationTokenRepository.deleteByExpiresAtBeforeOrUsedTrue(now);
        long deletedSessions = userSessionRepository.deleteByExpiresAtBeforeOrActiveFalse(sessionCutoff);

        if (deletedRefresh > 0 || deletedVerification > 0 || deletedSessions > 0) {
            logger.info("Scheduled cleanup: removed {} refresh tokens, {} verification tokens, {} stale sessions",
                    deletedRefresh, deletedVerification, deletedSessions);
        }
    }
}
