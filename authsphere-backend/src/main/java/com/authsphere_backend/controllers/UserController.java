package com.authsphere_backend.controllers;

import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/m1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    // ==========================================
    // CREATE USER API
    // POST /api/m1/users
    // ==========================================

    @PostMapping
    public ResponseEntity<UserDto> createUser(
            @RequestBody UserDto userDto
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(userDto));
    }


    // ==========================================
    // GET ALL USERS API
    // GET /api/m1/users
    // ==========================================

    @GetMapping
    public ResponseEntity<Iterable<UserDto>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    // ==========================================
    // GET USER BY EMAIL API
    // GET /api/m1/users/email/{email}
    // ==========================================

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(
            @PathVariable("email") String email
    ) {

        return ResponseEntity.ok(
                userService.getUserByEmail(email)
        );
    }


    // ==========================================
    // DELETE USER API
    // DELETE /api/m1/users/{userId}
    // ==========================================

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable("userId") String userId
    ) {

        userService.deleteUser(userId);

        return ResponseEntity.noContent().build();
    }


    // ==========================================
    // UPDATE USER API
    // PUT /api/m1/users/{userId}
    // ==========================================

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @RequestBody UserDto userDto,
            @PathVariable("userId") String userId
    ) {

        return ResponseEntity.ok(
                userService.updateUser(
                        userDto,
                        userId
                )
        );
    }


    // ==========================================
    // GET USER BY ID API
    // GET /api/m1/users/{userId}
    // ==========================================

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(
            @PathVariable("userId") String userId
    ) {

        return ResponseEntity.ok(
                userService.getUserById(userId)
        );
    }
}