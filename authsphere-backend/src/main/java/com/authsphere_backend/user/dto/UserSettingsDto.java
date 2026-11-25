package com.authsphere_backend.user.dto;


import com.authsphere_backend.user.dto.UserSettingsDto;
import com.authsphere_backend.user.entity.User;
public record UserSettingsDto(
        boolean securityNotifications,
        boolean locationTracking,
        boolean loginMonitoring,
        boolean automaticTokenRotation,
        String theme
) {
}
