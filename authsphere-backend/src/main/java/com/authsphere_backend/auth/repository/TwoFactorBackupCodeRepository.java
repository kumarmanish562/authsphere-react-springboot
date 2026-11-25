package com.authsphere_backend.auth.repository;

import com.authsphere_backend.auth.entity.TwoFactorBackupCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TwoFactorBackupCodeRepository extends JpaRepository<TwoFactorBackupCode, UUID> {

    List<TwoFactorBackupCode> findByUserIdAndUsedFalse(UUID userId);

    void deleteByUserId(UUID userId);
}
