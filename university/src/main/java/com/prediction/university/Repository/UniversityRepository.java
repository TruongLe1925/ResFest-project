package com.prediction.university.Repository;


import com.prediction.university.Entity.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University,Integer> {
    Optional<University> findByUniversityName(String universityName);
}
