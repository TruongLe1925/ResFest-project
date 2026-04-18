package com.prediction.university.Dao;

import com.prediction.university.Entity.University;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import javax.management.Query;
import java.util.List;
import java.util.Queue;

@Repository
public class UniversityDAOImpl implements UniversityDAO {
    private final EntityManager entityManger;

    public UniversityDAOImpl(EntityManager entityManger) {
        this.entityManger = entityManger;
    }

    @Override
    public University findUniversity(String name) {
        TypedQuery<University> query = entityManger.createQuery("SELECT u FROM University u LEFT JOIN FETCH u.major WHERE u.universityName =:name", University.class);
        query.setParameter("name",name);
        return query.getSingleResult();
    }
}
