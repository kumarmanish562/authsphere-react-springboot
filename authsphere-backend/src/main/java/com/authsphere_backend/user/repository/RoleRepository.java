package com.authsphere_backend.user.repository;


import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.repository.RoleRepository;
import com.authsphere_backend.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository
        extends JpaRepository<Role, UUID> {

    Optional<Role> findByName(String name);

    boolean existsByName(String name);
}