package com.authsphere_backend.admin.service;

import com.authsphere_backend.admin.dto.AdminStatsDto;
import com.authsphere_backend.user.dto.UserDto;

import java.util.List;
import java.util.UUID;

public interface AdminService {

    AdminStatsDto getStats();

    List<UserDto> getAllUsers();

    UserDto unlockUser(UUID userId);

    UserDto toggleUserStatus(UUID userId, boolean enabled);

    UserDto updateUserRole(UUID userId, String roleName);
}
