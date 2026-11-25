package com.authsphere_backend.user.dto;


import com.authsphere_backend.user.dto.RoleDto;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.entity.Provider;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class UserDto {

    private UUID id;

    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String name;

    private String image;

    private boolean enabled = true;

    private boolean emailVerified = false;

    private boolean twoFactorEnabled = false;

    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();

    private Provider provider = Provider.LOCAL;

    private Set<RoleDto> roles = new HashSet<>();
}