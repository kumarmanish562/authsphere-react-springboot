package com.authsphere_backend.user.service;


import com.authsphere_backend.user.service.UserServicesImpl;
import com.authsphere_backend.common.config.AppConstants;
import com.authsphere_backend.user.dto.UserDto;
import com.authsphere_backend.user.entity.Provider;
import com.authsphere_backend.user.entity.Role;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.common.exceptions.ResourceNotFoundException;
import com.authsphere_backend.common.helpers.UserHelper;
import com.authsphere_backend.user.repository.RoleRepository;
import com.authsphere_backend.user.repository.UserRepository;
import com.authsphere_backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;


/*
 * ============================================================
 * USER SERVICE IMPLEMENTATION
 * ============================================================
 */
@Service
@RequiredArgsConstructor
public class UserServicesImpl implements UserService {


    /*
     * ========================================================
     * DEPENDENCIES
     * ========================================================
     */

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final ModelMapper modelMapper;


    /*
     * ========================================================
     * CREATE USER
     * ========================================================
     */

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {

        // Check whether email is provided
        if (userDto.getEmail() == null ||
                userDto.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required"
            );
        }


        // Check whether email already exists
        if (userRepository.existsByEmail(userDto.getEmail())) {

            throw new IllegalArgumentException(
                    "Email already exists"
            );
        }


        // Convert UserDto into User entity
        User user = modelMapper.map(
                userDto,
                User.class
        );


        // Set authentication provider
        user.setProvider(
                userDto.getProvider() != null
                        ? userDto.getProvider()
                        : Provider.LOCAL
        );


        // Set account enabled
        user.setEnabled(true);

        // Assign default role to user
        Role defaultRole = roleRepository.findByName(AppConstants.ROLE_USER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(AppConstants.ROLE_USER).build()));
        user.setRoles(Set.of(defaultRole));

        // Save user into database
        User savedUser = userRepository.save(user);


        // Convert User entity into UserDto
        return modelMapper.map(
                savedUser,
                UserDto.class
        );
    }


    /*
     * ========================================================
     * GET USER BY EMAIL
     * ========================================================
     */

    @Override
    public UserDto getUserByEmail(String email) {

        // Find user by email
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with given email id : "
                                        + email
                        )
                );


        // Convert User entity into UserDto
        return modelMapper.map(
                user,
                UserDto.class
        );
    }


    /*
     * ========================================================
     * UPDATE USER
     * ========================================================
     */

    @Override
    public UserDto updateUser(
            UserDto userDto,
            String userId
    ) {

        // Convert String user ID into UUID
        UUID uId = UserHelper.parseUUID(userId);


        // Find existing user
        User existingUser = userRepository
                .findById(uId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with given id"
                        )
                );


        // Update user name
        if (userDto.getName() != null) {

            existingUser.setName(
                    userDto.getName()
            );
        }


        // Securely encode password on update
        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            existingUser.setPassword(
                    passwordEncoder.encode(userDto.getPassword())
            );
        }


        // Update profile image
        if (userDto.getImage() != null) {

            existingUser.setImage(
                    userDto.getImage()
            );
        }


        // Update account status
        existingUser.setEnabled(
                userDto.isEnabled()
        );


        // Save updated user
        User updatedUser =
                userRepository.save(existingUser);


        // Convert User entity into UserDto
        return modelMapper.map(
                updatedUser,
                UserDto.class
        );
    }


    /*
     * ========================================================
     * DELETE USER
     * ========================================================
     */

    @Override
    public void deleteUser(String userId) {

        // Convert String user ID into UUID
        UUID uId = UserHelper.parseUUID(userId);


        // Find user
        User user = userRepository
                .findById(uId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with given id"
                        )
                );


        // Delete user from database
        userRepository.delete(user);
    }


    /*
     * ========================================================
     * GET USER BY ID
     * ========================================================
     */

    @Override
    public UserDto getUserById(String userId) {

        // Convert String user ID into UUID
        UUID uId = UserHelper.parseUUID(userId);


        // Find user by UUID
        User user = userRepository
                .findById(uId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with given id"
                        )
                );


        // Convert User entity into UserDto
        return modelMapper.map(
                user,
                UserDto.class
        );
    }


    /*
     * ========================================================
     * GET ALL USERS
     * ========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public Iterable<UserDto> getAllUsers() {

        // Get all users from database
        return userRepository
                .findAll()
                .stream()
                .map(user ->
                        modelMapper.map(
                                user,
                                UserDto.class
                        )
                )
                .toList();
    }
}