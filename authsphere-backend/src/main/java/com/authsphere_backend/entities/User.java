package com.authsphere_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    // ==========================================
    // PRIMARY KEY
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID id;


    // ==========================================
    // USER EMAIL
    // ==========================================

    @Column(
            name = "user_email",
            unique = true,
            nullable = false,
            length = 300
    )
    private String email;


    // ==========================================
    // USER NAME
    // ==========================================

    @Column(
            name = "user_name",
            length = 500
    )
    private String name;


    // ==========================================
    // PASSWORD
    // ==========================================

    @Column(name = "password")
    private String password;


    // ==========================================
    // PROFILE IMAGE
    // ==========================================

    @Column(name = "image")
    private String image;


    // ==========================================
    // ACCOUNT STATUS
    // ==========================================

    @Column(name = "enabled")
    @Builder.Default
    private boolean enable = true;


    // ==========================================
    // TIMESTAMPS
    // ==========================================

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;


    // ==========================================
    // AUTHENTICATION PROVIDER
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(name = "provider")
    @Builder.Default
    private Provider provider = Provider.LOCAL;


    // ==========================================
    // USER ROLES
    // ==========================================

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",

            joinColumns = @JoinColumn(
                    name = "user_id"
            ),

            inverseJoinColumns = @JoinColumn(
                    name = "role_id"
            )
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();


    // ==========================================
    // BEFORE INSERT
    // ==========================================
    @PrePersist
    protected void onCreate() {

        Instant now = Instant.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }



    // ==========================================
    // BEFORE UPDATE
    // ==========================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt = Instant.now();
    }
}