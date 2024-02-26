package com.proiect.tripevolve.service.interfaces;

import com.proiect.tripevolve.dto.UserDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserDTO> getAll();
    Optional<UserDTO> findById(Integer user_id);
    Optional<UserDTO> findByFirstname(String firstname);
    UserDTO add(UserDTO userDTO);
    void deleteById(Integer user_id);
}
