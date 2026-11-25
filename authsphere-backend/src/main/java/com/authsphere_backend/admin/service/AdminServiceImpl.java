package com.authsphere_backend.admin.service;

import com.authsphere_backend.admin.dto.AdminStatsDto;
import com.authsphere_backend.common.config.AppConstants;
import com.authsphere_backend.common.exceptions.ResourceNotFoundException;
import com.authsphere_backend.security.dto.AuditLogDto;
import com.authsphere_backend.security.repository.AuditLogRepository;
import com.authsphere_backend.session.repository.UserSessionRepository;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.user.entity.Role;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.repository.RoleRepository;
import com.authsphere_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserSessionRepository sessionRepository;
    private final AuditLogRepository auditLogRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDto getStats() {
        Instant now = Instant.now();
        long totalUsers = userRepository.count();
        long activeSessions = sessionRepository.countByActiveTrueAndExpiresAtAfter(now);
        long lockedAccounts = userRepository.countByLockUntilAfter(now);

        List<AuditLogDto> logs = auditLogRepository.findTop20ByOrderByCreatedAtDesc()
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

        return new AdminStatsDto(totalUsers, activeSessions, lockedAccounts, logs);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> modelMapper.map(u, UserDto.class))
                .toList();
    }

    @Override
    @Transactional
    public UserDto unlockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFailedLoginAttempts(0);
        user.setLockUntil(null);
        return modelMapper.map(userRepository.save(user), UserDto.class);
    }

    @Override
    @Transactional
    public UserDto toggleUserStatus(UUID userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(enabled);
        return modelMapper.map(userRepository.save(user), UserDto.class);
    }

    @Override
    @Transactional
    public UserDto updateUserRole(UUID userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String normalized = AppConstants.ROLE_ADMIN.equalsIgnoreCase(roleName) || "ADMIN".equalsIgnoreCase(roleName)
                ? AppConstants.ROLE_ADMIN
                : AppConstants.ROLE_USER;

        Role role = roleRepository.findByName(normalized)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + normalized));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        return modelMapper.map(userRepository.save(user), UserDto.class);
    }
}
