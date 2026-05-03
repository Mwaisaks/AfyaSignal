package com.mwaisaka.AfyaSignal.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class FacilityResponse {
    private UUID id;
    private String name;
    private String village;
    private String subCounty;
    private String phone;
    private Integer totalBeds;
    private Integer availableBeds;
    private String operatingHours;
    private String managerName;
}