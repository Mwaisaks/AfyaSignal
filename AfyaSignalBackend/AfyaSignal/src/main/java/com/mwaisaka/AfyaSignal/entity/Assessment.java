package com.mwaisaka.AfyaSignal.entity;

import com.mwaisaka.AfyaSignal.enums.TriageCategory;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assessments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Child info
    @Column(nullable = false, unique = true)
    private String childId;

    @Column(nullable = false)
    private String childName;

    @Column(nullable = false)
    private Integer ageMonths;

    private String parentName;
    private String parentPhone;

    @Column(nullable = false)
    private String village;

    private Double weight;

    // Symptoms
    private boolean fever;
    private Integer feverDays;
    private boolean cough;
    private Integer coughDays;
    private boolean diarrhea;
    private Integer diarrheaDays;
    private boolean difficultyBreathing;
    private boolean rash;
    private boolean vomiting;
    private boolean lethargy;
    private boolean seizures;
    private String otherSymptoms;

    // Vitals
    private Double temperature;
    private Integer respiratoryRate;

    // Triage result
    @Enumerated(EnumType.STRING)
    private TriageCategory triageCategory;

    @Column(columnDefinition = "TEXT")
    private String triageExplanation;

    private String referralReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referral_facility_id")
    private Facility referralFacility;

    // CHV who submitted
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chv_id", nullable = false)
    private User chv;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}