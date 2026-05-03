package com.mwaisaka.AfyaSignal.controller;

import com.mwaisaka.AfyaSignal.dto.AssessmentRequest;
import com.mwaisaka.AfyaSignal.dto.AssessmentResponse;
import com.mwaisaka.AfyaSignal.entity.User;
import com.mwaisaka.AfyaSignal.service.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping
    @PreAuthorize("hasRole('CHV')")
    public ResponseEntity<AssessmentResponse> createAssessment(
            @Valid @RequestBody AssessmentRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                assessmentService.createAssessment(request, currentUser.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AssessmentResponse>> getAllAssessments() {
        return ResponseEntity.ok(assessmentService.getAllAssessments());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CHV')")
    public ResponseEntity<List<AssessmentResponse>> getMyAssessments(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                assessmentService.getAssessmentsByChv(currentUser.getId()));
    }

    @GetMapping("/emergency")
    @PreAuthorize("hasAnyRole('ADMIN', 'HEALTH_FACILITY')")
    public ResponseEntity<List<AssessmentResponse>> getEmergencyCases() {
        return ResponseEntity.ok(assessmentService.getEmergencyCases());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CHV', 'ADMIN', 'HEALTH_FACILITY')")
    public ResponseEntity<AssessmentResponse> getAssessmentById(@PathVariable UUID id) {
        return assessmentService.getAssessmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}