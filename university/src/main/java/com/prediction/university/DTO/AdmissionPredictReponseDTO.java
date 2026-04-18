package com.prediction.university.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionPredictReponseDTO {
    private int percentage;
    private String feedback;
    private String strengths;
    private String weaknesses;
}
