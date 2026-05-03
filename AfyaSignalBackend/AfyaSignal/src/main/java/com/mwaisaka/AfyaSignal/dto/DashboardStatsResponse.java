package com.mwaisaka.AfyaSignal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalAssessments;
    private long emergencyCases;
    private long urgentCases;
    private long totalCHVs;
    private long pendingAlerts;
    private long assessmentsThisWeek;
}