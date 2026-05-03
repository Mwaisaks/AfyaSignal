package com.mwaisaka.AfyaSignal.controller;

import com.mwaisaka.AfyaSignal.dto.FacilityResponse;
import com.mwaisaka.AfyaSignal.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CHV')")
    public ResponseEntity<List<FacilityResponse>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHV', 'HEALTH_FACILITY')")
    public ResponseEntity<FacilityResponse> getFacilityById(@PathVariable UUID id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    @GetMapping("/subcounty/{subCounty}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FacilityResponse>> getFacilitiesBySubCounty(
            @PathVariable String subCounty) {
        return ResponseEntity.ok(facilityService.getFacilitiesBySubCounty(subCounty));
    }

    @GetMapping("/village/{village}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHV')")
    public ResponseEntity<List<FacilityResponse>> getFacilitiesByVillage(
            @PathVariable String village) {
        return ResponseEntity.ok(facilityService.getFacilitiesByVillage(village));
    }
}