package com.mwaisaka.AfyaSignal.service;

import com.mwaisaka.AfyaSignal.dto.AssessmentRequest;
import com.mwaisaka.AfyaSignal.enums.TriageCategory;

public interface GeminiService {

    String generateExplanation(AssessmentRequest request, TriageCategory category);


}
