package com.mwaisaka.AfyaSignal.mapper;

import com.mwaisaka.AfyaSignal.dto.FacilityResponse;
import com.mwaisaka.AfyaSignal.entity.Facility;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface FacilityMapper {

    @Mapping(target = "managerName", source = "manager.name")
    FacilityResponse toResponse(Facility facility);
}