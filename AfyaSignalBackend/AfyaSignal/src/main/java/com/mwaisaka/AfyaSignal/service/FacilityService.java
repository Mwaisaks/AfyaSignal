package com.mwaisaka.AfyaSignal.service;

import com.mwaisaka.AfyaSignal.dto.FacilityResponse;

import java.util.List;
import java.util.UUID;

public interface FacilityService {

    List<FacilityResponse> getAllFacilities();

    FacilityResponse getFacilityById(UUID id);

    List<FacilityResponse> getFacilitiesBySubCounty(String subCounty);

    List<FacilityResponse> getFacilitiesByVillage(String village);
}
