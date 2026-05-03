package com.mwaisaka.AfyaSignal.controller;

import com.mwaisaka.AfyaSignal.dto.AlertResponse;
import com.mwaisaka.AfyaSignal.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HEALTH_FACILITY')")
    public ResponseEntity<List<AlertResponse>> getActiveAlerts() {
        return ResponseEntity.ok(alertService.getActiveAlerts());
    }

    @PatchMapping("/{id}/acknowledge")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AlertResponse> acknowledgeAlert(@PathVariable UUID id) {
        return ResponseEntity.ok(alertService.acknowledgeAlert(id));
    }
}