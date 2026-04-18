package com.prediction.university.Dao;

import com.prediction.university.Entity.University;

import java.util.List;

public interface UniversityDAO {
    University findUniversity(String name);
}
