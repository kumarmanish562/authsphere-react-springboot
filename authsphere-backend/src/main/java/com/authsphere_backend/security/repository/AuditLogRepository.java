package com.authsphere_backend.security.repository;


import com.authsphere_backend.security.repository.AuditLogRepository;
import com.authsphere_backend.security.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    List<AuditLog> findTop20ByUserIdOrderByCreatedAtDesc(UUID userId);

    long countByUserIdAndStatusAndCreatedAtAfter(UUID userId, String status, Instant after);
}
