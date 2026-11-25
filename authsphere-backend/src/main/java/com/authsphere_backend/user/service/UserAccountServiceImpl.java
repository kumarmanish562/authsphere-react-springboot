package com.authsphere_backend.user.service;


import com.authsphere_backend.user.service.UserAccountServiceImpl;
import com.authsphere_backend.auth.security.TotpService;
import com.authsphere_backend.user.dto.ChangePasswordRequest;
import com.authsphere_backend.user.dto.UpdateProfileRequest;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.user.dto.UserSettingsDto;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.entity.UserSettings;
import com.authsphere_backend.common.exceptions.ResourceNotFoundException;
import com.authsphere_backend.user.repository.UserRepository;
import com.authsphere_backend.user.repository.UserSettingsRepository;
import com.authsphere_backend.security.service.AuditLogService;
import com.authsphere_backend.user.service.UserAccountService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserAccountServiceImpl implements UserAccountService {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    private final TotpService totpService;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    @Transactional
    public UserDto updateProfile(UUID userId, UpdateProfileRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(request.name().trim());
        if (request.image() != null) {
            user.setImage(request.image().trim().isEmpty() ? null : request.image().trim());
        }

        User saved = userRepository.save(user);
        auditLogService.log(saved, "PROFILE_UPDATED", "Updated account profile information", "SUCCESS", httpRequest);

        return modelMapper.map(saved, UserDto.class);
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
                auditLogService.log(user, "PASSWORD_CHANGE", "Failed password change attempt (invalid current password)", "FAILURE", httpRequest);
                throw new BadCredentialsException("Current password is incorrect");
            }
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        auditLogService.log(user, "PASSWORD_CHANGE", "Account password updated successfully", "SUCCESS", httpRequest);
    }

    @Override
    @Transactional
    public UserSettingsDto getSettings(UUID userId) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    return settingsRepository.save(UserSettings.builder().user(user).build());
                });

        return toDto(settings);
    }

    @Override
    @Transactional
    public UserSettingsDto updateSettings(UUID userId, UserSettingsDto request, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> UserSettings.builder().user(user).build());

        settings.setSecurityNotifications(request.securityNotifications());
        settings.setLocationTracking(request.locationTracking());
        settings.setLoginMonitoring(request.loginMonitoring());
        settings.setAutomaticTokenRotation(request.automaticTokenRotation());
        if (request.theme() != null && !request.theme().isBlank()) {
            settings.setTheme(request.theme().trim());
        }

        UserSettings saved = settingsRepository.save(settings);
        auditLogService.log(user, "SETTINGS_UPDATED", "Updated security and notification preferences", "SUCCESS", httpRequest);

        return toDto(saved);
    }

    @Override
    @Transactional
    public UserDto toggleTwoFactor(UUID userId, boolean enabled, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setTwoFactorEnabled(enabled);
        if (!enabled) {
            user.setTotpSecret(null);
        }
        User saved = userRepository.save(user);

        auditLogService.log(saved, "TWO_FACTOR_UPDATED",
                enabled ? "Enabled two-factor authentication" : "Disabled two-factor authentication",
                enabled ? "SUCCESS" : "WARNING", httpRequest);

        return modelMapper.map(saved, UserDto.class);
    }

    @Override
    @Transactional
    public java.util.Map<String, String> setupTwoFactor(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String secret = totpService.generateSecret();
        user.setTotpSecret(secret);
        userRepository.save(user);

        String otpAuthUri = totpService.buildOtpAuthUri(user.getEmail(), secret);
        return java.util.Map.of("secret", secret, "otpAuthUri", otpAuthUri);
    }

    @Override
    @Transactional
    public UserDto verifyAndEnableTwoFactor(UUID userId, String code, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!totpService.verifyCode(user.getTotpSecret(), code)) {
            throw new BadCredentialsException("Invalid 6-digit verification code");
        }

        user.setTwoFactorEnabled(true);
        User saved = userRepository.save(user);

        auditLogService.log(saved, "TWO_FACTOR_ENABLED",
                "Verified and enabled TOTP two-factor authentication",
                "SUCCESS", httpRequest);

        return modelMapper.map(saved, UserDto.class);
    }

    @Override
    @Transactional
    public UserDto verifyEmail(UUID userId, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEmailVerified(true);
        User saved = userRepository.save(user);

        auditLogService.log(saved, "EMAIL_VERIFIED", "Primary email address verified", "SUCCESS", httpRequest);
        return modelMapper.map(saved, UserDto.class);
    }

    private UserSettingsDto toDto(UserSettings settings) {
        return new UserSettingsDto(
                settings.isSecurityNotifications(),
                settings.isLocationTracking(),
                settings.isLoginMonitoring(),
                settings.isAutomaticTokenRotation(),
                settings.getTheme()
        );
    }
}
