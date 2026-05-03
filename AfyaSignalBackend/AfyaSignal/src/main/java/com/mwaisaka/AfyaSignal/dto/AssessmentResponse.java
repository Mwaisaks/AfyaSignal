package com.mwaisaka.AfyaSignal.dto;

import com.mwaisaka.AfyaSignal.enums.TriageCategory;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AssessmentResponse {
    private UUID id;
    private String childId;
    private String childName;
    private Integer ageMonths;
    private String village;
    private TriageCategory triageCategory;
    private String triageExplanation;
    private String referralFacilityName;
    private String referralReason;
    private String chvName;
    private LocalDateTime createdAt;
}