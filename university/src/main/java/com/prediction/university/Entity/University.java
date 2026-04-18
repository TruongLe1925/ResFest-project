package com.prediction.university.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "university")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "university_name")
    private String universityName;

    @Column(name = "average_admission_score")
    private Double averageAdmissionScore;
    @Column(name = "year")
    private int year;
    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Major> major;
}
