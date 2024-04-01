package com.proiect.tripevolve.auth.repository;
import com.proiect.tripevolve.auth.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Transactional
    @Modifying
    @Query("update User u set u.role=com.proiect.tripevolve.auth.util.Constant$UserRole.ADMIN where u.id_user=?1")
    Integer makeAdmin(Integer id);

    Optional<User> findUserByEmail(String email);
}
