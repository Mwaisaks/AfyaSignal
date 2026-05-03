package com.mwaisaka.AfyaSignal.service.impl;

import com.mwaisaka.AfyaSignal.dto.AssessmentRequest;
import com.mwaisaka.AfyaSignal.dto.AssessmentResponse;
import com.mwaisaka.AfyaSignal.entity.Assessment;
import com.mwaisaka.AfyaSignal.entity.User;
import com.mwaisaka.AfyaSignal.enums.TriageCategory;
import com.mwaisaka.AfyaSignal.exception.ResourceNotFoundException;
import com.mwaisaka.AfyaSignal.mapper.AssessmentMapper;
import com.mwaisaka.AfyaSignal.repository.AssessmentRepository;
import com.mwaisaka.AfyaSignal.repository.FacilityRepository;
import com.mwaisaka.AfyaSignal.repository.UserRepository;
import com.mwaisaka.AfyaSignal.service.AlertService;
import com.mwaisaka.AfyaSignal.service.AssessmentService;
import com.mwaisaka.AfyaSignal.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentServiceImpl implements AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final AssessmentMapper assessmentMapper;
    private final GeminiService geminiService;
    private final AlertService alertService;

    public AssessmentResponse createAssessment(AssessmentRequest request, UUID chvId) {
        User chv = userRepository.findById(chvId)
                .orElseThrow(() -> new ResourceNotFoundException("CHV not found"));

        Assessment assessment = assessmentMapper.toEntity(request);
        assessment.setChildId(generateChildId());
        assessment.setChv(chv);

        // Step 1: Rule-based triage
        TriageCategory category = runTriageRules(request);
        assessment.setTriageCategory(category);

        // Step 2: Set referral facility if emergency/urgent
        if (request.getReferralFacilityId() != null) {
            facilityRepository.findById(request.getReferralFacilityId())
                    .ifPresent(assessment::setReferralFacility);
        }

        // Step 3: AI explanation via Gemini
        String explanation = geminiService.generateExplanation(request, category);
        assessment.setTriageExplanation(explanation);

        Assessment saved = assessmentRepository.save(assessment);

        // Step 4: Check for outbreak clusters in this village
        alertService.checkForOutbreakClusters(request.getVillage());

        return assessmentMapper.toResponse(saved);
    }

    public List<AssessmentResponse> getAssessmentsByChv(UUID chvId) {
        return assessmentRepository.findByChvId(chvId)
                .stream()
                .map(assessmentMapper::toResponse)
                .toList();
    }

    public List<AssessmentResponse> getAllAssessments() {
        return assessmentRepository.findAll()
                .stream()
                .map(assessmentMapper::toResponse)
                .toList();
    }

    public List<AssessmentResponse> getEmergencyCases() {
        return assessmentRepository
                .findByTriageCategory(TriageCategory.EMERGENCY)
                .stream()
                .map(assessmentMapper::toResponse)
                .toList();
    }

    @Override
    public Optional<AssessmentResponse> getAssessmentById(UUID id) {
        return assessmentRepository.findById(id)
                .map(assessmentMapper::toResponse);
    }

    // ===== Rule-based triage engine =====
    // Inspired by WHO IMCI guidelines for children under 5
    private TriageCategory runTriageRules(AssessmentRequest r) {

        // EMERGENCY — immediate danger to life
        if (r.isSeizures() || r.isLethargy()) {
            return TriageCategory.EMERGENCY;
        }
        if (r.isSeizures()) return TriageCategory.EMERGENCY;
        if (r.isFever() && r.getFeverDays() != null && r.getFeverDays() >= 5) {
            return TriageCategory.EMERGENCY;
        }
        if (r.isDifficultyBreathing() && r.isVomiting()) {
            return TriageCategory.EMERGENCY;
        }
        if (r.getRespiratoryRate() != null) {
            // WHO fast breathing thresholds by age
            int rr = r.getRespiratoryRate();
            int age = r.getAgeMonths();
            boolean fastBreathing =
                    (age < 2 && rr >= 60) ||
                            (age >= 2 && age < 12 && rr >= 50) ||
                            (age >= 12 && rr >= 40);
            if (fastBreathing && r.isDifficultyBreathing()) {
                return TriageCategory.EMERGENCY;
            }
        }

        // URGENT — needs same-day attention
        if (r.isDifficultyBreathing()) return TriageCategory.URGENT;
        if (r.isFever() && r.isDiarrhea()) return TriageCategory.URGENT;
        if (r.isFever() && r.getFeverDays() != null && r.getFeverDays() >= 3) {
            return TriageCategory.URGENT;
        }
        if (r.isVomiting() && r.isDiarrhea()) return TriageCategory.URGENT;
        if (r.getAgeMonths() < 2 && r.isFever()) return TriageCategory.URGENT;

        // PRIORITY — needs attention but not immediately
        if (r.isFever() || r.isCough() || r.isDiarrhea() || r.isVomiting()) {
            return TriageCategory.PRIORITY;
        }

        // GENERAL — monitor at home
        return TriageCategory.GENERAL;
    }

    private String generateChildId() {
        int year = Year.now().getValue();
        int number = new Random().nextInt(9000) + 1000;
        return String.format("CHILD-%d-%04d", year, number);
    }
}
