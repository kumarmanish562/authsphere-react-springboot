package com.authsphere_backend.services.impl;

import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.entities.Provider;
import com.authsphere_backend.entities.User;
import com.authsphere_backend.exceptions.ResourceNotFoundException;
import com.authsphere_backend.helpers.UserHelper;
import com.authsphere_backend.repositories.UserRepository;
import com.authsphere_backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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


        // TODO: Assign default role to user


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

                // Throw exception when user is not found
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
        User exitingUser = userRepository
                .findById(uId)

                // Throw exception when user is not found
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with given id"
                        )
                );


        // Update user name
        if (userDto.getName() != null) {

            exitingUser.setName(
                    userDto.getName()
            );
        }


        // TODO: Implement secure password update logic
        if (userDto.getPassword() != null) {

            exitingUser.setPassword(
                    userDto.getPassword()
            );
        }


        // Update profile image
        if (userDto.getImage() != null) {

            exitingUser.setImage(
                    userDto.getImage()
            );
        }


        // Update authentication provider
        if (userDto.getProvider() != null) {

            exitingUser.setProvider(
                    userDto.getProvider()
            );
        }


        // Update account status
        exitingUser.setEnable(
                userDto.isEnable()
        );


        // Save updated user
        User updatedUser =
                userRepository.save(exitingUser);


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

                // Throw exception when user is not found
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

                // Throw exception when user is not found
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

                // Convert List<User> into Stream<User>
                .stream()

                // Convert every User into UserDto
                .map(user ->
                        modelMapper.map(
                                user,
                                UserDto.class
                        )
                )

                // Convert Stream into List<UserDto>
                .toList();
    }
}