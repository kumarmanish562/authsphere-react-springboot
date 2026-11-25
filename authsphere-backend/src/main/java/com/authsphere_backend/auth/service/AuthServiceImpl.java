package com.authsphere_backend.auth.service;


import com.authsphere_backend.auth.service.AuthServiceImpl;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.auth.dto.RegisterRequest;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.user.entity.Provider;
import com.authsphere_backend.auth.service.AuthService;
import com.authsphere_backend.user.service.UserService;
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