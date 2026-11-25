package com.authsphere_backend.auth.service;


import com.authsphere_backend.auth.service.AuthService;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.auth.dto.RegisterRequest;
import com.authsphere_backend.user.dto.UserDto;

public interface AuthService {

    UserDto registerUser(RegisterRequest request);
}