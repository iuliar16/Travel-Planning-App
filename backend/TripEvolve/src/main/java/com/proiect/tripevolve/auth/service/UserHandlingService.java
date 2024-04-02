package com.proiect.tripevolve.auth.service;

import com.proiect.tripevolve.auth.dto.SimpleUserDTO;
import com.proiect.tripevolve.auth.dto.UserRegisterDTO;
import com.proiect.tripevolve.auth.model.User;

import java.util.List;
import java.util.Optional;

public interface UserHandlingService {
    User registerUser(UserRegisterDTO registerDTO);
    Integer makeAdmin(Integer id);

    Optional<User> findUserByEmail(String email);
    void deleteUserById(int id);
    Optional<User> findUserById_user(int id);

    List<User> getAllUsers();
    List<SimpleUserDTO> getAllUsersByIds(String ids);
    User updateUser(int id, User updatedUser);

    void resetPassword(String email, String password);
    void enableUser(String email);
}
