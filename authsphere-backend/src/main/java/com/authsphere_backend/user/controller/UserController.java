package com.authsphere_backend.user.controller;


import com.authsphere_backend.user.controller.UserController;
import com.authsphere_backend.common.config.AppConstants;
import com.authsphere_backend.user.dto.ChangePasswordRequest;
import com.authsphere_backend.user.dto.UpdateProfileRequest;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.user.dto.UserSettingsDto;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.service.UserAccountService;
import com.authsphere_backend.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/m1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserAccountService userAccountService;

    // ============================================================
    // CURRENT USER PROFILE & SETTINGS (AUTHENTICATED USER)
    // ============================================================

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userAccountService.getCurrentUser(user.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(userAccountService.updateProfile(user.getId(), request, httpRequest));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        userAccountService.changePassword(user.getId(), request, httpRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/settings")
    public ResponseEntity<UserSettingsDto> getSettings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userAccountService.getSettings(user.getId()));
    }

    @PutMapping("/settings")
    public ResponseEntity<UserSettingsDto> updateSettings(
            @AuthenticationPrincipal User user,
            @RequestBody UserSettingsDto request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(userAccountService.updateSettings(user.getId(), request, httpRequest));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteOwnAccount(@AuthenticationPrincipal User user) {
        userService.deleteUser(user.getId().toString());
        return ResponseEntity.noContent().build();
    }


    // ============================================================
    // ADMIN USER MANAGEMENT ENDPOINTS
    // ============================================================

    @PreAuthorize("hasRole('" + AppConstants.ADMIN_ROLE + "')")
    @PostMapping
    public ResponseEntity<UserDto> createUser(
            @RequestBody UserDto userDto
    ) {
        UserDto createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PreAuthorize("hasRole('" + AppConstants.ADMIN_ROLE + "')")
    @GetMapping
    public ResponseEntity<Iterable<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(
            @PathVariable("email") String email
    ) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PreAuthorize("hasRole('" + AppConstants.ADMIN_ROLE + "')")
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(
            @PathVariable("userId") String userId
    ) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PreAuthorize("hasRole('" + AppConstants.ADMIN_ROLE + "')")
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable("userId") String userId,
            @RequestBody UserDto userDto
    ) {
        return ResponseEntity.ok(userService.updateUser(userDto, userId));
    }

    @PreAuthorize("hasRole('" + AppConstants.ADMIN_ROLE + "')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable("userId") String userId
    ) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}