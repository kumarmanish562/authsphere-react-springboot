package com.authsphere_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "refresh_tokens",
        indexes = {

                @Index(
                        name = "refresh_tokens_jti_idx",
                        columnList = "jti",
                        unique = true
                ),

                @Index(
                        name = "refresh_tokens_user_id_idx",
                        columnList = "user_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    @Column(
            name = "jti",
            nullable = false,
            unique = true,
            updatable = false
    )
    private String jti;


    @ManyToOne(
            optional = false,
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "user_id",
            nullable = false,
            updatable = false
    )
    private User user;


    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;


    @Column(
            name = "expires_at",
            nullable = false
    )
    private Instant expiresAt;


    @Column(
            name = "revoked",
            nullable = false
    )
    private boolean revoked;


    @Column(
            name = "replaced_by_token"
    )
    private String replacedByToken;
}