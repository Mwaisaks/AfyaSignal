package com.mwaisaka.AfyaSignal.service.impl;

import com.mwaisaka.AfyaSignal.dto.AlertResponse;
import com.mwaisaka.AfyaSignal.entity.Alert;
import com.mwaisaka.AfyaSignal.enums.AlertStatus;
import com.mwaisaka.AfyaSignal.exception.ResourceNotFoundException;
import com.mwaisaka.AfyaSignal.mapper.AlertMapper;
import com.mwaisaka.AfyaSignal.repository.AlertRepository;
import com.mwaisaka.AfyaSignal.repository.AssessmentRepository;
import com.mwaisaka.AfyaSignal.service.AlertService;
import com.mwaisaka.AfyaSignal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;
    private final AssessmentRepository assessmentRepository;
    private final AlertMapper alertMapper;
    private final NotificationService notificationService;

    private static final int CLUSTER_THRESHOLD = 3;
    private static final int DAY_WINDOW = 7;

    public List<AlertResponse> getActiveAlerts() {
        return alertRepository
                .findByStatusOrderByCreatedAtDesc(AlertStatus.NEW)
                .stream()
                .map(alertMapper::toResponse)
                .toList();
    }

    public AlertResponse acknowledgeAlert(UUID id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));
        alert.setStatus(AlertStatus.ACKNOWLEDGED);
        return alertMapper.toResponse(alertRepository.save(alert));
    }

    public void checkForOutbreakClusters(String village) {
        LocalDateTime since = LocalDateTime.now().minusDays(DAY_WINDOW);
        List<?> cases = assessmentRepository
                .findSymptomClustersByVillage(village, since);

        if (cases.size() >= CLUSTER_THRESHOLD) {
            boolean alertExists = alertRepository
                    .findByVillage(village)
                    .stream()
                    .anyMatch(a -> a.getStatus() == AlertStatus.NEW);

            if (!alertExists) {
                Alert alert = Alert.builder()
                        .type("Symptom Cluster Detected")
                        .village(village)
                        .message(String.format(
                                "%d cases with overlapping symptoms reported in %s over the last %d days. Possible outbreak — please investigate.",
                                cases.size(), village, DAY_WINDOW))
                        .caseCount(cases.size())
                        .dayWindow(DAY_WINDOW)
                        .status(AlertStatus.NEW)
                        .build();

                Alert saved = alertRepository.save(alert);
                notificationService.notifyAdminsOfOutbreakAlert(saved);
                log.warn("Outbreak alert generated for village: {}", village);
            }
        }
    }
}
