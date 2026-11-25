package com.authsphere_backend.auth.service;


import com.authsphere_backend.auth.dto.RegisterRequest;
import com.authsphere_backend.auth.entity.VerificationToken;
import com.authsphere_backend.auth.repository.VerificationTokenRepository;
import com.authsphere_backend.common.service.EmailService;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.user.entity.Provider;
import com.authsphere_backend.user.repository.UserRepository;
import com.authsphere_backend.user.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

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

        UserDto created = userService.createUser(userDto);

        userRepository.findById(created.getId()).ifPresent(savedUser -> {
            String token = UUID.randomUUID().toString();
            verificationTokenRepository.save(VerificationToken.builder()
                    .token(token)
                    .type(VerificationToken.TokenType.EMAIL_VERIFY)
                    .user(savedUser)
                    .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                    .build());
            emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getName(), token);
        });

        return created;
    }
}