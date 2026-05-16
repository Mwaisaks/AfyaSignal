package com.mwaisaka.AfyaSignal.mapper;

import com.mwaisaka.AfyaSignal.dto.NotificationResponse;
import com.mwaisaka.AfyaSignal.entity.Notification;
import org.mapstruct.Mapper;

@Mapper
public interface NotificationMapper {
    NotificationResponse toResponse(Notification notification);
}
