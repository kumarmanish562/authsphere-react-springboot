package com.authsphere_backend.admin.controller;

import com.authsphere_backend.admin.dto.AdminStatsDto;
import com.authsphere_backend.admin.service.AdminService;
import com.authsphere_backend.common.config.AppConstants;
import com.authsphere_backend.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/m1/admin")
@PreAuthorize("hasRole('" + AppConstants.ADMIN_ROLE + "')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/unlock")
    public ResponseEntity<UserDto> unlockUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(adminService.unlockUser(userId));
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<UserDto> toggleUserStatus(
            @PathVariable UUID userId,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean enabled = Boolean.TRUE.equals(body.get("enabled"));
        return ResponseEntity.ok(adminService.toggleUserStatus(userId, enabled));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable UUID userId,
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(adminService.updateUserRole(userId, body.get("role")));
    }
}
