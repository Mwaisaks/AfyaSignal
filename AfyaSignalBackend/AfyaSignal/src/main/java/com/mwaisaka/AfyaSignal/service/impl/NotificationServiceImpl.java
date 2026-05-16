package com.mwaisaka.AfyaSignal.service.impl;

import com.mwaisaka.AfyaSignal.dto.NotificationResponse;
import com.mwaisaka.AfyaSignal.entity.Alert;
import com.mwaisaka.AfyaSignal.entity.Assessment;
import com.mwaisaka.AfyaSignal.entity.Notification;
import com.mwaisaka.AfyaSignal.entity.User;
import com.mwaisaka.AfyaSignal.enums.NotificationType;
import com.mwaisaka.AfyaSignal.enums.TriageCategory;
import com.mwaisaka.AfyaSignal.enums.UserRole;
import com.mwaisaka.AfyaSignal.exception.ResourceNotFoundException;
import com.mwaisaka.AfyaSignal.mapper.NotificationMapper;
import com.mwaisaka.AfyaSignal.repository.NotificationRepository;
import com.mwaisaka.AfyaSignal.repository.UserRepository;
import com.mwaisaka.AfyaSignal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public List<NotificationResponse> getNotificationsForUser(UUID userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    public List<NotificationResponse> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalse(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdAndIsReadFalse(userId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void createNotification(UUID recipientId, UserRole recipientRole, String title,
                                   String message, NotificationType type, UUID referenceId,
                                   String referenceType) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .recipientRole(recipientRole)
                .title(title)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .build();

        notificationRepository.save(notification);
    }

    public void notifyAdminsOfCriticalCase(Assessment assessment) {
        if (assessment.getTriageCategory() != TriageCategory.EMERGENCY
                && assessment.getTriageCategory() != TriageCategory.URGENT) {
            return;
        }

        List<User> admins = userRepository.findByRole(UserRole.ADMIN);
        admins.forEach(admin -> createNotification(
                admin.getId(),
                admin.getRole(),
                String.format("New %s Case", assessment.getTriageCategory()),
                String.format("A %s case has been reported for %s in %s by CHV %s.",
                        assessment.getTriageCategory(),
                        assessment.getChildName(),
                        assessment.getVillage(),
                        assessment.getChv().getName()),
                NotificationType.CRITICAL_CASE_FLAGGED,
                assessment.getId(),
                "ASSESSMENT"
        ));
    }

    public void notifyFacilityOfReferral(Assessment assessment) {
        if (assessment.getReferralFacility() == null
                || assessment.getReferralFacility().getManager() == null) {
            return;
        }

        User manager = assessment.getReferralFacility().getManager();
        createNotification(
                manager.getId(),
                manager.getRole(),
                "New Incoming Referral",
                String.format("A referral has been sent for %s, %d months, risk: %s. Referred by CHV %s from %s.",
                        assessment.getChildName(),
                        assessment.getAgeMonths(),
                        assessment.getTriageCategory(),
                        assessment.getChv().getName(),
                        assessment.getVillage()),
                NotificationType.REFERRAL_INCOMING,
                assessment.getId(),
                "REFERRAL"
        );
    }

    public void notifyChvOfSubmission(Assessment assessment) {
        User chv = assessment.getChv();
        createNotification(
                chv.getId(),
                chv.getRole(),
                "Assessment Submitted",
                String.format("Case %s for %s has been submitted successfully. Risk level: %s.",
                        assessment.getChildId(),
                        assessment.getChildName(),
                        assessment.getTriageCategory()),
                NotificationType.ASSESSMENT_SUBMITTED,
                assessment.getId(),
                "ASSESSMENT"
        );
    }

    public void notifyAdminsOfOutbreakAlert(Alert alert) {
        List<User> admins = userRepository.findByRole(UserRole.ADMIN);
        admins.forEach(admin -> createNotification(
                admin.getId(),
                admin.getRole(),
                String.format("Outbreak Alert \u2014 %s", alert.getVillage()),
                alert.getMessage(),
                NotificationType.OUTBREAK_ALERT_GENERATED,
                alert.getId(),
                "ALERT"
        ));
    }
}
