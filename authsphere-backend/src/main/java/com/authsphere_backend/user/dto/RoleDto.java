package com.authsphere_backend.user.dto;



import com.authsphere_backend.user.dto.RoleDto;
import com.authsphere_backend.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class RoleDto {

    private UUID id;

    private String name;
}
