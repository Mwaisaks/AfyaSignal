package com.mwaisaka.AfyaSignal.mapper;

import com.mwaisaka.AfyaSignal.dto.AlertResponse;
import com.mwaisaka.AfyaSignal.entity.Alert;
import org.mapstruct.Mapper;

@Mapper
public interface AlertMapper {
    AlertResponse toResponse(Alert alert);
}