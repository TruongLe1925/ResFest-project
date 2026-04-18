package com.prediction.university.Service.UniversityService;
import com.prediction.university.DTO.MajorDTO;
import com.prediction.university.DTO.UniversityDTO;
import com.prediction.university.Entity.Major;

import java.util.List;

public interface UniversityService {
    List<UniversityDTO> university();
    List<MajorDTO> major(String universityDTO);
}
