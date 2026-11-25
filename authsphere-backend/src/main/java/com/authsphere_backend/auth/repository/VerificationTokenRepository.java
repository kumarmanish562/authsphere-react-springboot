package com.authsphere_backend.auth.repository;

import com.authsphere_backend.auth.entity.VerificationToken;
import com.authsphere_backend.auth.entity.VerificationToken.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {

    Optional<VerificationToken> findByTokenAndType(String token, TokenType type);

    long deleteByExpiresAtBeforeOrUsedTrue(Instant cutoff);
}
