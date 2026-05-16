package com.mwaisaka.AfyaSignal.dto;

import com.mwaisaka.AfyaSignal.enums.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class NotificationResponse {
    private UUID id;
    private String title;
    private String message;
    private NotificationType type;
    private UUID referenceId;
    private String referenceType;
    private boolean isRead;
    private LocalDateTime createdAt;
}
