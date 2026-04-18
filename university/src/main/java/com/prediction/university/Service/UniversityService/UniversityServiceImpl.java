package com.prediction.university.Service.UniversityService;


import com.prediction.university.DTO.MajorDTO;
import com.prediction.university.DTO.UniversityDTO;
import com.prediction.university.Dao.UniversityDAO;
import com.prediction.university.Entity.Major;
import com.prediction.university.Entity.University;
import com.prediction.university.Repository.UniversityRepository;
import com.prediction.university.Service.UniversityService.UniversityService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class UniversityServiceImpl implements UniversityService {
    private UniversityRepository universityRepository;
    private UniversityDAO universityDAO;
    public UniversityServiceImpl(UniversityRepository universityRepository,UniversityDAO universityDAO) {
        this.universityRepository = universityRepository;
        this.universityDAO = universityDAO;
    }
    @Override
    public List<UniversityDTO> university() {
        List<University> university = universityRepository.findAll();
        List<UniversityDTO> universityDTOS = university.stream().map(uni ->
                UniversityDTO.builder()
                        .universityName(uni.getUniversityName())
                        .build())
                .collect(Collectors.toList());
        return universityDTOS;
    }

    @Override
    public List<MajorDTO> major(String universityDTO) {
        University university = universityDAO.findUniversity(universityDTO);
        if (university == null) {
            return List.of();
        }
        List<Major> majors = university.getMajor();
        List<MajorDTO> majorDTOS = majors.stream().map(major -> MajorDTO.builder()
                        .majorName(major.getMajorName())
                        .build())
                .collect(Collectors.toList());
        return majorDTOS;
    }
}
