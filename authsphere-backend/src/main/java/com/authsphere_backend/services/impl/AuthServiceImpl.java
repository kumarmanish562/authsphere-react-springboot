package com.authsphere_backend.services.impl;

import com.authsphere_backend.dtos.UserDto;
import com.authsphere_backend.services.AuthService;
import com.authsphere_backend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;

    @Override
    public UserDto registerUser(UserDto userDto) {

        //login
        //verify email
        //verify password
        //default roles
      UserDto userDto1 =  userService.createUser(userDto);

        return userDto1;
    }
}
