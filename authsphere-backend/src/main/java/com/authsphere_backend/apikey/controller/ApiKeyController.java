package com.authsphere_backend.apikey.controller;


import com.authsphere_backend.apikey.controller.ApiKeyController;
import com.authsphere_backend.apikey.entity.ApiKey;
import com.authsphere_backend.apikey.dto.ApiKeyDto;
import com.authsphere_backend.apikey.dto.CreateApiKeyRequest;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.apikey.service.ApiKeyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/m1/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @PostMapping
    public ResponseEntity<ApiKeyDto> createApiKey(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateApiKeyRequest request,
            HttpServletRequest httpRequest
    ) {
        ApiKeyDto created = apiKeyService.createApiKey(user.getId(), request, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ApiKeyDto>> listApiKeys(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(apiKeyService.listApiKeys(user.getId()));
    }

    @DeleteMapping("/{keyId}")
    public ResponseEntity<Void> revokeApiKey(
            @AuthenticationPrincipal User user,
            @PathVariable UUID keyId,
            HttpServletRequest httpRequest
    ) {
        apiKeyService.revokeApiKey(user.getId(), keyId, httpRequest);
        return ResponseEntity.noContent().build();
    }
}
