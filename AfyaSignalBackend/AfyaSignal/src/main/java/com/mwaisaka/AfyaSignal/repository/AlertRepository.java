package com.mwaisaka.AfyaSignal.repository;

import com.mwaisaka.AfyaSignal.entity.Alert;
import com.mwaisaka.AfyaSignal.enums.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {
    List<Alert> findByStatus(AlertStatus status);
    List<Alert> findByVillage(String village);
    List<Alert> findByStatusOrderByCreatedAtDesc(AlertStatus status);
    long countByStatus(AlertStatus status);
}