package com.authsphere_backend.user.repository;


import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.repository.UserSettingsRepository;
import com.authsphere_backend.user.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserSettingsRepository extends JpaRepository<UserSettings, UUID> {

    Optional<UserSettings> findByUserId(UUID userId);
}
