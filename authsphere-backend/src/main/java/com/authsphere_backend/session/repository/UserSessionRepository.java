package com.authsphere_backend.session.repository;


import com.authsphere_backend.session.repository.UserSessionRepository;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.session.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {

    List<UserSession> findByUserIdAndActiveTrueOrderByLastActiveAtDesc(UUID userId);

    Optional<UserSession> findByIdAndUserId(UUID id, UUID userId);

    Optional<UserSession> findByJti(String jti);

    @Modifying
    @Query("UPDATE UserSession s SET s.active = false WHERE s.user.id = :userId AND s.jti <> :currentJti AND s.active = true")
    int revokeOtherSessions(@Param("userId") UUID userId, @Param("currentJti") String currentJti);

    @Modifying
    @Query("UPDATE UserSession s SET s.active = false WHERE s.user.id = :userId AND s.active = true")
    int revokeAllUserSessions(@Param("userId") UUID userId);
}
