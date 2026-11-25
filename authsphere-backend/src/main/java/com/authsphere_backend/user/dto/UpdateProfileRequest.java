package com.authsphere_backend.user.dto;


import com.authsphere_backend.user.dto.UpdateProfileRequest;
import com.authsphere_backend.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name,

        @Size(max = 500, message = "Image URL must be under 500 characters")
        String image
) {
}
