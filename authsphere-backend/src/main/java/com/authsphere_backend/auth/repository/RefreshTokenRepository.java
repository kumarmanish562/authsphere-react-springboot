package com.authsphere_backend.auth.repository;


import com.authsphere_backend.auth.repository.RefreshTokenRepository;
import com.authsphere_backend.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByJti(String jti);
}