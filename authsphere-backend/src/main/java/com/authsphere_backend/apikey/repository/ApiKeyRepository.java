package com.authsphere_backend.apikey.repository;


import com.authsphere_backend.apikey.repository.ApiKeyRepository;
import com.authsphere_backend.apikey.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID> {

    List<ApiKey> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<ApiKey> findByIdAndUserId(UUID id, UUID userId);

    Optional<ApiKey> findByKeyHashAndActiveTrue(String keyHash);
}
