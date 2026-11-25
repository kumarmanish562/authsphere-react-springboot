package com.authsphere_backend.user.dto;


import com.authsphere_backend.user.dto.ChangePasswordRequest;
import com.authsphere_backend.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "Current password is required")
        String currentPassword,

        @NotBlank(message = "New password is required")
        @Size(min = 8, max = 128, message = "New password must be at least 8 characters")
        String newPassword
) {
}
