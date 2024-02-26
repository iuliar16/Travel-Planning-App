package com.proiect.tripevolve.service.impl;

import com.proiect.tripevolve.dto.UserDTO;
import com.proiect.tripevolve.repository.UserRepository;
import com.proiect.tripevolve.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserDTO> getAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<UserDTO> findById(Integer user_id) {
        return userRepository.findById(user_id);
    }

    @Override
    public Optional<UserDTO> findByFirstname(String user_id) {
        return userRepository.findByFirstname(user_id);
    }

    @Override
    public UserDTO add(UserDTO userDTO) {
        return userRepository.save(userDTO);
    }

    @Override
    public void deleteById(Integer user_id) {
        userRepository.deleteById(user_id);
    }

}
