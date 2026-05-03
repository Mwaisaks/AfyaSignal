package com.mwaisaka.AfyaSignal.dto;

import com.mwaisaka.AfyaSignal.enums.TriageCategory;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class TriageResultResponse {
    private TriageCategory category;
    private String explanation;
    private List<String> recommendations;
    private String referralFacilityName;
    private String referralReason;
    private boolean requiresImmediateReferral;
}