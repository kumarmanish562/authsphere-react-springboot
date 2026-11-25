package com.authsphere_backend.apikey.service;


import com.authsphere_backend.apikey.entity.ApiKey;
import com.authsphere_backend.apikey.service.ApiKeyService;
import com.authsphere_backend.apikey.dto.ApiKeyDto;
import com.authsphere_backend.apikey.dto.CreateApiKeyRequest;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.UUID;

public interface ApiKeyService {

    ApiKeyDto createApiKey(UUID userId, CreateApiKeyRequest request, HttpServletRequest httpRequest);

    List<ApiKeyDto> listApiKeys(UUID userId);

    void revokeApiKey(UUID userId, UUID keyId, HttpServletRequest httpRequest);
}
