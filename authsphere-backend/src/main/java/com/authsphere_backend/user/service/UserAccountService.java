package com.authsphere_backend.user.service;


import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.service.UserAccountService;
import com.authsphere_backend.user.dto.ChangePasswordRequest;
import com.authsphere_backend.user.dto.UpdateProfileRequest;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.user.dto.UserSettingsDto;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;
import java.util.UUID;

public interface UserAccountService {

    UserDto getCurrentUser(UUID userId);

    UserDto updateProfile(UUID userId, UpdateProfileRequest request, HttpServletRequest httpRequest);

    void changePassword(UUID userId, ChangePasswordRequest request, HttpServletRequest httpRequest);

    UserSettingsDto getSettings(UUID userId);

    UserSettingsDto updateSettings(UUID userId, UserSettingsDto request, HttpServletRequest httpRequest);

    UserDto toggleTwoFactor(UUID userId, boolean enabled, HttpServletRequest httpRequest);

    Map<String, String> setupTwoFactor(UUID userId);

    UserDto verifyAndEnableTwoFactor(UUID userId, String code, HttpServletRequest httpRequest);

    UserDto verifyEmail(UUID userId, HttpServletRequest httpRequest);
}
