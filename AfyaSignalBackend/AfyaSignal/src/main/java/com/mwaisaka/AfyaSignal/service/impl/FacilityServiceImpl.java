package com.mwaisaka.AfyaSignal.service.impl;

import com.mwaisaka.AfyaSignal.dto.FacilityResponse;
import com.mwaisaka.AfyaSignal.exception.ResourceNotFoundException;
import com.mwaisaka.AfyaSignal.mapper.FacilityMapper;
import com.mwaisaka.AfyaSignal.repository.FacilityRepository;
import com.mwaisaka.AfyaSignal.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;
    private final FacilityMapper facilityMapper;

    public List<FacilityResponse> getAllFacilities() {
        return facilityRepository.findAll()
                .stream()
                .map(facilityMapper::toResponse)
                .toList();
    }

    public FacilityResponse getFacilityById(UUID id) {
        return facilityRepository.findById(id)
                .map(facilityMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));
    }

    @Override
    public List<FacilityResponse> getFacilitiesBySubCounty(String subCounty) {
        return facilityRepository.findBySubCounty(subCounty)
                .stream()
                .map(facilityMapper::toResponse)
                .toList();
    }

    @Override
    public List<FacilityResponse> getFacilitiesByVillage(String village) {
        return facilityRepository.findByVillage(village)
                .stream()
                .map(facilityMapper::toResponse)
                .toList();
    }
}
