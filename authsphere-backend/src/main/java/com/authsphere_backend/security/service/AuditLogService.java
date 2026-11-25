package com.authsphere_backend.security.service;


import com.authsphere_backend.security.service.AuditLogService;
import com.authsphere_backend.security.dto.AuditLogDto;
import com.authsphere_backend.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.UUID;

public interface AuditLogService {

    void log(User user, String action, String description, String status, HttpServletRequest request);

    List<AuditLogDto> getRecentLogs(UUID userId);
}
