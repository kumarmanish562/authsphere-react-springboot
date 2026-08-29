package com.authsphere_backend.services;

import com.authsphere_backend.dtos.UserDto;

public interface AuthService {

    UserDto registerUser(UserDto userDto);

    //login user
}
