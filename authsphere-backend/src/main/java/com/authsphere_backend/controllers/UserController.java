package com.authsphere_backend.controllers;

import com.authsphere_backend.config.AppConstants;
import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/m1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    // ============================================================
    // CREATE USER
    // POST /api/m1/users
    // ============================================================

    @PostMapping
    public ResponseEntity<UserDto> createUser(
            @RequestBody UserDto userDto
    ) {

        UserDto createdUser =
                userService.createUser(userDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdUser);
    }


    // ============================================================
    // GET ALL USERS
    // GET /api/m1/users
    // ============================================================

    @GetMapping
    public ResponseEntity<Iterable<UserDto>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    // ============================================================
    // GET USER BY EMAIL
    // GET /api/m1/users/email/{email}
    // ============================================================

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(
            @PathVariable("email") String email
    ) {

        return ResponseEntity.ok(
                userService.getUserByEmail(email)
        );
    }


    // ============================================================
    // GET USER BY ID
    // GET /api/m1/users/{userId}
    // ADMIN ONLY
    // ============================================================

    @PreAuthorize(
            "hasRole('" + AppConstants.ADMIN_ROLE + "')"
    )
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(
            @PathVariable("userId") String userId
    ) {

        return ResponseEntity.ok(
                userService.getUserById(userId)
        );
    }


    // ============================================================
    // UPDATE USER
    // PUT /api/m1/users/{userId}
    // ============================================================

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable("userId") String userId,
            @RequestBody UserDto userDto
    ) {

        return ResponseEntity.ok(
                userService.updateUser(
                        userDto,
                        userId
                )
        );
    }


    // ============================================================
    // DELETE USER
    // DELETE /api/m1/users/{userId}
    // ============================================================

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable("userId") String userId
    ) {

        userService.deleteUser(userId);

        return ResponseEntity
                .noContent()
                .build();
    }
}