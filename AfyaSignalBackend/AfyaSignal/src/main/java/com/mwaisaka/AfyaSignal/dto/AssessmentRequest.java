package com.mwaisaka.AfyaSignal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.util.UUID;

@Data
public class AssessmentRequest {

    // Child info
    @NotBlank
    private String childName;

    @NotNull
    @Min(1)
    private Integer ageMonths; // already converted to months by frontend

    private String parentName;
    private String parentPhone;

    @NotBlank
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

    // Referral (optional — set by triage engine)
    private UUID referralFacilityId;
}