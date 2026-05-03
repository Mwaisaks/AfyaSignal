package com.mwaisaka.AfyaSignal.mapper;

import com.mwaisaka.AfyaSignal.dto.AssessmentRequest;
import com.mwaisaka.AfyaSignal.dto.AssessmentResponse;
import com.mwaisaka.AfyaSignal.entity.Assessment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface AssessmentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "childId", ignore = true)
    @Mapping(target = "triageCategory", ignore = true)
    @Mapping(target = "triageExplanation", ignore = true)
    @Mapping(target = "referralFacility", ignore = true)
    @Mapping(target = "referralReason", ignore = true)
    @Mapping(target = "chv", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Assessment toEntity(AssessmentRequest request);

    @Mapping(target = "chvName", source = "chv.name")
    @Mapping(target = "referralFacilityName", source = "referralFacility.name")
    AssessmentResponse toResponse(Assessment assessment);
}