package com.mwaisaka.AfyaSignal.service;

import com.mwaisaka.AfyaSignal.dto.AssessmentRequest;
import com.mwaisaka.AfyaSignal.dto.AssessmentResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssessmentService {

    AssessmentResponse createAssessment(AssessmentRequest request, UUID chvId);

    List<AssessmentResponse> getAssessmentsByChv(UUID chvId);

    List<AssessmentResponse> getAllAssessments();

    List<AssessmentResponse> getEmergencyCases();

    Optional<AssessmentResponse> getAssessmentById(UUID id);
}
