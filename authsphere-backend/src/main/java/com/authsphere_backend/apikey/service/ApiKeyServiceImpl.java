package com.authsphere_backend.apikey.service;


import com.authsphere_backend.apikey.service.ApiKeyServiceImpl;
import com.authsphere_backend.apikey.dto.ApiKeyDto;
import com.authsphere_backend.apikey.dto.CreateApiKeyRequest;
import com.authsphere_backend.apikey.entity.ApiKey;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.common.exceptions.ResourceNotFoundException;
import com.authsphere_backend.apikey.repository.ApiKeyRepository;
import com.authsphere_backend.user.repository.UserRepository;
import com.authsphere_backend.apikey.service.ApiKeyService;
import com.authsphere_backend.security.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApiKeyServiceImpl implements ApiKeyService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public ApiKeyDto createApiKey(UUID userId, CreateApiKeyRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String env = "TEST".equalsIgnoreCase(request.environment()) ? "TEST" : "LIVE";
        String prefix = "TEST".equals(env) ? "as_test_" : "as_live_";

        byte[] randomBytes = new byte[24];
        SECURE_RANDOM.nextBytes(randomBytes);
        String secretPart = HexFormat.of().formatHex(randomBytes);
        String plainTextKey = prefix + secretPart;

        String lastFour = secretPart.substring(secretPart.length() - 4).toUpperCase();
        String keyHash = sha256(plainTextKey);

        Instant expiresAt = (request.expiresInDays() != null && request.expiresInDays() > 0)
                ? Instant.now().plus(request.expiresInDays(), ChronoUnit.DAYS)
                : null;

        String scopes = (request.scopes() != null && !request.scopes().isBlank())
                ? request.scopes().trim()
                : "read,write";

        ApiKey apiKey = ApiKey.builder()
                .user(user)
                .name(request.name().trim())
                .keyPrefix(prefix)
                .keyHash(keyHash)
                .lastFour(lastFour)
                .environment(env)
                .scopes(scopes)
                .active(true)
                .createdAt(Instant.now())
                .expiresAt(expiresAt)
                .build();

        ApiKey saved = apiKeyRepository.save(apiKey);

        auditLogService.log(user, "API_KEY_CREATED",
                "Created " + env + " API key: " + saved.getName(),
                "SUCCESS", httpRequest);

        return toDto(saved, plainTextKey);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApiKeyDto> listApiKeys(UUID userId) {
        return apiKeyRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(k -> toDto(k, null))
                .toList();
    }

    @Override
    @Transactional
    public void revokeApiKey(UUID userId, UUID keyId, HttpServletRequest httpRequest) {
        ApiKey apiKey = apiKeyRepository.findByIdAndUserId(keyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("API key not found"));

        String keyName = apiKey.getName();
        apiKeyRepository.delete(apiKey);

        userRepository.findById(userId).ifPresent(user ->
                auditLogService.log(user, "API_KEY_REVOKED",
                        "Revoked and deleted API key: " + keyName,
                        "WARNING", httpRequest)
        );
    }

    private ApiKeyDto toDto(ApiKey apiKey, String plainTextKey) {
        String masked = apiKey.getKeyPrefix() + "••••••••••••••" + apiKey.getLastFour();
        return new ApiKeyDto(
                apiKey.getId(),
                apiKey.getName(),
                masked,
                apiKey.getEnvironment(),
                apiKey.getScopes(),
                apiKey.isActive(),
                apiKey.getCreatedAt(),
                apiKey.getExpiresAt(),
                apiKey.getLastUsedAt(),
                plainTextKey
        );
    }

    private static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
