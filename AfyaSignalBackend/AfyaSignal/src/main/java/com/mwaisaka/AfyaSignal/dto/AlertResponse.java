package com.mwaisaka.AfyaSignal.dto;

import com.mwaisaka.AfyaSignal.enums.AlertStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AlertResponse {
    private UUID id;
    private String type;
    private String village;
    private String message;
    private Integer caseCount;
    private Integer dayWindow;
    private AlertStatus status;
    private LocalDateTime createdAt;
}