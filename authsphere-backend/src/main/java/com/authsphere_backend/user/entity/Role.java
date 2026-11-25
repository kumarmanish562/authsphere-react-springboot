package com.authsphere_backend.user.entity;


import com.authsphere_backend.user.entity.Role;
import com.authsphere_backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "roles")
public class Role {

    // ==========================================
    // PRIMARY KEY
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "role_id")
    private UUID id;


    // ==========================================
    // ROLE NAME
    // ==========================================

    @Column(
            name = "role_name",
            unique = true,
            nullable = false,
            length = 100
    )
    private String name;


    // ==========================================
    // USERS
    // ==========================================

    @ManyToMany(mappedBy = "roles")
    @Builder.Default
    private Set<User> users = new HashSet<>();
}