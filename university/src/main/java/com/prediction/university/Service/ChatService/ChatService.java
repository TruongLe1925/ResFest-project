package com.prediction.university.Service.ChatService;


import com.prediction.university.DTO.AdmissionPredictReponseDTO;
import com.prediction.university.DTO.AdmissionPredictRequestDTO;
import org.springframework.web.multipart.MultipartFile;

public interface ChatService {
    AdmissionPredictReponseDTO reponse(MultipartFile file, AdmissionPredictRequestDTO requestDTO);
}
