package com.authsphere_backend.services;

import com.authsphere_backend.dtos.RegisterRequest;
import com.authsphere_backend.dtos.UserDto;

public interface AuthService {

    UserDto registerUser(RegisterRequest request);
}