package com.proiect.tripevolve.repository;

import com.proiect.tripevolve.dto.UserDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserDTO, Integer> {
    @Query("SELECT l FROM User l WHERE l.firstname=:firstname")
    Optional<UserDTO> findByFirstname(@Param("firstname") String firstname);
}