package com.authsphere_backend.services.impl;

import com.authsphere_backend.dtos.RegisterRequest;
import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.entities.Provider;
import com.authsphere_backend.services.AuthService;
import com.authsphere_backend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto registerUser(RegisterRequest request) {

        // =====================================================
        // CREATE USER DTO
        // =====================================================

        UserDto userDto = new UserDto();

        userDto.setName(request.getName());

        userDto.setEmail(request.getEmail());

        // =====================================================
        // ENCODE PASSWORD
        // =====================================================

        userDto.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // =====================================================
        // DEFAULT USER SETTINGS
        // =====================================================

        userDto.setEnabled(true);

        userDto.setProvider(
                Provider.LOCAL
        );

        // =====================================================
        // SAVE USER
        // =====================================================

        return userService.createUser(userDto);
    }
}