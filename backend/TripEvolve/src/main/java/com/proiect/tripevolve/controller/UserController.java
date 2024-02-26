package com.proiect.tripevolve.controller;

import com.proiect.tripevolve.dto.UserDTO;
import com.proiect.tripevolve.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/tripEvolve/api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    ResponseEntity<?> getAllUsers() {
        return new ResponseEntity<>(this.userService.getAll(), HttpStatus.OK);

    }

    @GetMapping("/{id}")
    ResponseEntity<?> getUserById(@PathVariable Integer id) {
        Optional<UserDTO> userDTO = this.userService.findById(id);
        if (userDTO.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);

    }

    @GetMapping("/firstname")
    ResponseEntity<Optional<UserDTO>> getUserByFirstname(@RequestParam String firstname) {
        Optional<UserDTO> userDTO = this.userService.findByFirstname(firstname);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);

    }

    @PostMapping
    ResponseEntity<?> createUser(@RequestBody UserDTO userDTO) {
        return new ResponseEntity<>(this.userService.add(userDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteUserById(@PathVariable Integer id) {
        this.userService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

}
