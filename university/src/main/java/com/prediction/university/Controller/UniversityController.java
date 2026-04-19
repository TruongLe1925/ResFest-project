package com.prediction.university.Controller;


import com.prediction.university.DTO.CerDTO;
import com.prediction.university.DTO.MajorDTO;
import com.prediction.university.DTO.UniversityDTO;

import com.prediction.university.Entity.Certification;
import com.prediction.university.Service.UniversityService.UniversityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@
        CrossOrigin(origins = "*")
public class UniversityController {
    private final UniversityService universityService;

    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }

    @GetMapping("/university")
    public List<UniversityDTO> getUniversity() {
        return universityService.university();
    }
    @GetMapping("/major")
    public List<MajorDTO> getMajor(@RequestParam String universityDTO) {
        return universityService.major(universityDTO);
    }

    @GetMapping("/certification")
    public List<CerDTO> getCertification() {
        return universityService.certification();
    }
}
