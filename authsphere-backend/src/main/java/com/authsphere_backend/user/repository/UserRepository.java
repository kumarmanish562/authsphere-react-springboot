package com.authsphere_backend.user.repository;


import com.authsphere_backend.user.repository.UserRepository;
import com.authsphere_backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);



}
