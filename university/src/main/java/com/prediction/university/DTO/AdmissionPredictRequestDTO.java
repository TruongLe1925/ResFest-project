package com.prediction.university.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdmissionPredictRequestDTO {
    @NotBlank(message = "Tên trường không được để trống")
    private String universityName;
    @NotNull(message = "Điểm thi không được để trống")
    @Min(value = 0, message = "Điểm thi không được nhỏ hơn 0")
    @Max(value = 30, message = "Điểm thi tối đa là 30")
    private Double examScore;
    @NotBlank(message = "Tên ngành không được để trống")
    private String majorName;
    @Min(value = 0, message = "Điểm thi không được nhỏ hơn 0")
    @Max(value = 1200, message = "Điểm đánh giá năng lực tối đa là 1200")
    private Integer competencyAssessmentScore;
    @NotBlank(message = "Tên chứng chỉ không được để trống")
    private String certificateType;
    @Min(value = 0, message = "Điểm chứng chỉ không được nhỏ hơn 0")
    private Double certificateScore;
    @Min(value = 0, message = "Điểm học bạ nhỏ nhất là 0")
    @Max(value = 10, message = "Điểm học bạ toi đa là 10")
    private Double transcriptScores;

}
