package com.authsphere_backend.security.service;


import com.authsphere_backend.security.service.AuditLogServiceImpl;
import com.authsphere_backend.security.dto.AuditLogDto;
import com.authsphere_backend.security.entity.AuditLog;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.common.helpers.RequestMetadataHelper;
import com.authsphere_backend.security.repository.AuditLogRepository;
import com.authsphere_backend.security.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public void log(User user, String action, String description, String status, HttpServletRequest request) {
        if (user == null) return;

        String ip = RequestMetadataHelper.extractClientIp(request);
        String ua = RequestMetadataHelper.extractUserAgent(request);

        AuditLog log = AuditLog.builder()
                .user(user)
                .action(action)
                .description(description)
                .status(status != null ? status : "SUCCESS")
                .ipAddress(ip)
                .userAgent(ua)
                .build();

        auditLogRepository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDto> getRecentLogs(UUID userId) {
        return auditLogRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(l -> new AuditLogDto(
                        l.getId(),
                        l.getAction(),
                        l.getDescription(),
                        l.getStatus(),
                        l.getIpAddress(),
                        l.getCreatedAt()
                ))
                .toList();
    }
}
