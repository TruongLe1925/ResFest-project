package com.prediction.university.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cert_id")
    private Integer id;
    @Column(name = "cert_name")
    private String name;
}
