package com.authsphere_backend.security.controller;


import com.authsphere_backend.security.controller.SecurityController;
import com.authsphere_backend.security.dto.SecurityOverviewDto;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.security.service.SecurityService;
import com.authsphere_backend.user.service.UserAccountService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/m1/security")
@RequiredArgsConstructor
public class SecurityController {

    private final SecurityService securityService;
    private final UserAccountService userAccountService;

    @GetMapping("/overview")
    public ResponseEntity<SecurityOverviewDto> getSecurityOverview(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(securityService.getSecurityOverview(user.getId()));
    }

    @PutMapping("/two-factor")
    public ResponseEntity<UserDto> toggleTwoFactor(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Boolean> body,
            HttpServletRequest request
    ) {
        boolean enabled = Boolean.TRUE.equals(body.get("enabled"));
        return ResponseEntity.ok(userAccountService.toggleTwoFactor(user.getId(), enabled, request));
    }

    @PostMapping("/two-factor/setup")
    public ResponseEntity<Map<String, String>> setupTwoFactor(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userAccountService.setupTwoFactor(user.getId()));
    }

    @PostMapping("/two-factor/verify")
    public ResponseEntity<Map<String, Object>> verifyTwoFactor(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                userAccountService.verifyAndEnableTwoFactor(user.getId(), body.get("code"), request)
        );
    }

    @PostMapping("/verify-email")
    public ResponseEntity<UserDto> verifyEmail(
            @AuthenticationPrincipal User user,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(userAccountService.verifyEmail(user.getId(), request));
    }
}
