package com.mwaisaka.AfyaSignal.service;

import com.mwaisaka.AfyaSignal.dto.NotificationResponse;
import com.mwaisaka.AfyaSignal.entity.Alert;
import com.mwaisaka.AfyaSignal.entity.Assessment;
import com.mwaisaka.AfyaSignal.enums.NotificationType;
import com.mwaisaka.AfyaSignal.enums.UserRole;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    List<NotificationResponse> getNotificationsForUser(UUID userId);

    List<NotificationResponse> getUnreadNotifications(UUID userId);

    long getUnreadCount(UUID userId);

    void markAsRead(UUID notificationId);

    void markAllAsRead(UUID userId);

    void createNotification(UUID recipientId, UserRole recipientRole, String title,
                            String message, NotificationType type, UUID referenceId,
                            String referenceType);

    void notifyAdminsOfCriticalCase(Assessment assessment);

    void notifyFacilityOfReferral(Assessment assessment);

    void notifyChvOfSubmission(Assessment assessment);

    void notifyAdminsOfOutbreakAlert(Alert alert);
}
