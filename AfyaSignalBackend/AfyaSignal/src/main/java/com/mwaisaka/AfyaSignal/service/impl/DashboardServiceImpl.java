package com.mwaisaka.AfyaSignal.service.impl;

import com.mwaisaka.AfyaSignal.dto.DashboardStatsResponse;
import com.mwaisaka.AfyaSignal.enums.AlertStatus;
import com.mwaisaka.AfyaSignal.enums.TriageCategory;
import com.mwaisaka.AfyaSignal.enums.UserRole;
import com.mwaisaka.AfyaSignal.repository.AlertRepository;
import com.mwaisaka.AfyaSignal.repository.AssessmentRepository;
import com.mwaisaka.AfyaSignal.repository.UserRepository;
import com.mwaisaka.AfyaSignal.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final AlertRepository alertRepository;

    public DashboardStatsResponse getStats() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);

        return DashboardStatsResponse.builder()
                .totalAssessments(assessmentRepository.count())
                .emergencyCases(assessmentRepository
                        .countByTriageCategory(TriageCategory.EMERGENCY))
                .urgentCases(assessmentRepository
                        .countByTriageCategory(TriageCategory.URGENT))
                .totalCHVs(userRepository.findByRole(UserRole.CHV).size())
                .pendingAlerts(alertRepository
                        .countByStatus(AlertStatus.NEW))
                .assessmentsThisWeek(assessmentRepository
                        .countByCreatedAtAfter(oneWeekAgo))
                .build();
    }
}