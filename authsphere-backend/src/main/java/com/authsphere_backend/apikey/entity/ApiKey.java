package com.authsphere_backend.apikey.entity;


import com.authsphere_backend.apikey.entity.ApiKey;
import com.authsphere_backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "api_keys",
        indexes = {
                @Index(name = "idx_api_key_user_id", columnList = "user_id"),
                @Index(name = "idx_api_key_hash", columnList = "key_hash", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "api_key_id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "key_prefix", nullable = false, length = 32)
    private String keyPrefix;

    @Column(name = "key_hash", nullable = false, unique = true, length = 128)
    private String keyHash;

    @Column(name = "last_four", nullable = false, length = 8)
    private String lastFour;

    @Column(name = "environment", nullable = false, length = 16)
    @Builder.Default
    private String environment = "LIVE";

    @Column(name = "scopes", length = 256)
    @Builder.Default
    private String scopes = "read,write";

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "last_used_at")
    private Instant lastUsedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
