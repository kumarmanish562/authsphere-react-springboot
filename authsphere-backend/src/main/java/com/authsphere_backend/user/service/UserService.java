package com.authsphere_backend.user.service;


import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.service.UserService;
import com.authsphere_backend.user.dto.UserDto;



public interface UserService {

  //create user
    UserDto  createUser(UserDto userDto);

    //get user by email
    UserDto getUserByEmail(String email);

    //update user
    UserDto updateUser(UserDto userDto, String userId);

    //delete user
    void deleteUser(String userId);


    //get user by id
    UserDto getUserById(String userId);

    //get all users
    Iterable<UserDto> getAllUsers();


    //user service se related----- add
}
