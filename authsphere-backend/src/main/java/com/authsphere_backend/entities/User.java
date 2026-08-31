package com.authsphere_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;


/*
 * ============================================================
 * USER ENTITY + SPRING SECURITY USERDETAILS
 * ============================================================
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails {

    // ==========================================================
    // PRIMARY KEY
    // ==========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID id;


    // ==========================================================
    // USER EMAIL
    // ==========================================================

    @Column(
            name = "user_email",
            unique = true,
            nullable = false,
            length = 300
    )
    private String email;


    // ==========================================================
    // USER NAME
    // ==========================================================

    @Column(
            name = "user_name",
            length = 500
    )
    private String name;


    // ==========================================================
    // PASSWORD
    // ==========================================================

    @Column(name = "password")
    private String password;


    // ==========================================================
    // PROFILE IMAGE
    // ==========================================================

    @Column(name = "image")
    private String image;


    // ==========================================================
    // ACCOUNT STATUS
    // ==========================================================

    @Column(name = "enabled")
    @Builder.Default
    private boolean enabled = true;


    // ==========================================================
    // TIMESTAMPS
    // ==========================================================

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;


    // ==========================================================
    // AUTHENTICATION PROVIDER
    // ==========================================================

    @Enumerated(EnumType.STRING)
    @Column(name = "provider")
    @Builder.Default
    private Provider provider = Provider.LOCAL;


    // ==========================================================
    // OAUTH2 PROVIDER USER ID
    // Google -> sub
    // GitHub -> id
    // ==========================================================

    @Column(name = "provider_id")
    private String providerId;


    // ==========================================================
    // USER ROLES
    // ==========================================================

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


    // ==========================================================
    // BEFORE INSERT
    // ==========================================================

    @PrePersist
    protected void onCreate() {

        Instant now = Instant.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }

        // Make sure new users are enabled
        // if no explicit value was provided.
        // Primitive boolean already defaults to false,
        // so this is handled through the field initializer.
    }


    // ==========================================================
    // BEFORE UPDATE
    // ==========================================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt = Instant.now();
    }


    // ==========================================================
    // SPRING SECURITY
    // GET AUTHORITIES / ROLES
    // ==========================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return roles
                .stream()
                .map(role ->
                        new SimpleGrantedAuthority(
                                role.getName()
                        )
                )
                .toList();
    }


    // ==========================================================
    // SPRING SECURITY
    // GET USERNAME
    // ==========================================================

    @Override
    public String getUsername() {

        return this.email;
    }


    // ==========================================================
    // ACCOUNT NOT EXPIRED
    // ==========================================================

    @Override
    public boolean isAccountNonExpired() {

        return true;
    }


    // ==========================================================
    // ACCOUNT NOT LOCKED
    // ==========================================================

    @Override
    public boolean isAccountNonLocked() {

        return true;
    }


    // ==========================================================
    // CREDENTIALS NOT EXPIRED
    // ==========================================================

    @Override
    public boolean isCredentialsNonExpired() {

        return true;
    }


    // ==========================================================
    // ACCOUNT ENABLED
    // ==========================================================

    @Override
    public boolean isEnabled() {

        return this.enabled;
    }
}