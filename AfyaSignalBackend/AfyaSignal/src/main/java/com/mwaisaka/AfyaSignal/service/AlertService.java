package com.mwaisaka.AfyaSignal.service;

import com.mwaisaka.AfyaSignal.dto.AlertResponse;

import java.util.List;
import java.util.UUID;

public interface AlertService {

    List<AlertResponse> getActiveAlerts();

    AlertResponse acknowledgeAlert(UUID id);

    void checkForOutbreakClusters(String village);
}
