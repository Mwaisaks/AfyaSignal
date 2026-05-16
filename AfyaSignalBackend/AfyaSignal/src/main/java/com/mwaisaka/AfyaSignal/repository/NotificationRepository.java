package com.mwaisaka.AfyaSignal.repository;

import com.mwaisaka.AfyaSignal.entity.Notification;
import com.mwaisaka.AfyaSignal.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByRecipientIdOrderByCreatedAtDesc(UUID recipientId);

    List<Notification> findByRecipientIdAndIsReadFalse(UUID recipientId);

    long countByRecipientIdAndIsReadFalse(UUID recipientId);

    List<Notification> findByRecipientRoleOrderByCreatedAtDesc(UserRole role);
}
