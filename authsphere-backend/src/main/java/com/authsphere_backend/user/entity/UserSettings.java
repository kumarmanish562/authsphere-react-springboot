package com.authsphere_backend.user.entity;


import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.entity.UserSettings;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "settings_id")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "security_notifications", nullable = false)
    @Builder.Default
    private boolean securityNotifications = true;

    @Column(name = "location_tracking", nullable = false)
    @Builder.Default
    private boolean locationTracking = true;

    @Column(name = "login_monitoring", nullable = false)
    @Builder.Default
    private boolean loginMonitoring = true;

    @Column(name = "automatic_token_rotation", nullable = false)
    @Builder.Default
    private boolean automaticTokenRotation = true;

    @Column(name = "theme", nullable = false, length = 32)
    @Builder.Default
    private String theme = "dark";

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
