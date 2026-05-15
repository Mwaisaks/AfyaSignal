"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  apiRequest,
  type AlertResponse,
  type AssessmentResponse,
  type DashboardStatsResponse,
} from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssessmentChart } from "@/components/charts/assessment-chart";
import { TriageDistributionChart } from "@/components/charts/triage-distribution-chart";
import { CaseStatusWidget } from "@/components/case-status-widget";
import { mockWeeklyAssessments } from "@/lib/mockData";
import type { TriageCategory } from "@/lib/types";

const triageCategoryMap: Record<AssessmentResponse["triageCategory"], TriageCategory> = {
  EMERGENCY: "emergency",
  URGENT: "urgent",
  PRIORITY: "priority",
  GENERAL: "general",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [assessments, setAssessments] = useState<AssessmentResponse[]>([]);
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    Promise.all([
      apiRequest<DashboardStatsResponse>("/api/dashboard/stats"),
      apiRequest<AssessmentResponse[]>("/api/assessments"),
      apiRequest<AlertResponse[]>("/api/alerts"),
    ])
      .then(([statsResponse, assessmentsResponse, alertsResponse]) => {
        setStats(statsResponse);
        setAssessments(assessmentsResponse);
        setAlerts(alertsResponse);
      })
      .catch(() => setError("Unable to load admin dashboard data."));
  }, [user]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const totalAssessments = stats?.totalAssessments ?? assessments.length;
  const activeCases = assessments.filter(c => c.triageCategory === "EMERGENCY" || c.triageCategory === "URGENT").length;
  const pendingAlerts = stats?.pendingAlerts ?? alerts.filter(a => a.status === "NEW").length;
  const totalChvs = stats?.totalCHVs ?? 0;
  const triageDistribution = [
    { category: "Emergency", value: assessments.filter(a => a.triageCategory === "EMERGENCY").length, color: "#DC2626" },
    { category: "Urgent", value: assessments.filter(a => a.triageCategory === "URGENT").length, color: "#EA580C" },
    { category: "Priority", value: assessments.filter(a => a.triageCategory === "PRIORITY").length, color: "#2D7A4A" },
    { category: "General", value: assessments.filter(a => a.triageCategory === "GENERAL").length, color: "#68C67C" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">System Administrator Dashboard</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/40 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{totalAssessments}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{activeCases}</p>
            <p className="text-xs text-muted-foreground mt-1">Pending referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-secondary">{pendingAlerts}</p>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active CHVs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{totalChvs}</p>
            <p className="text-xs text-muted-foreground mt-1">In the field</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Assessment Trend</CardTitle>
            <CardDescription>Assessments conducted over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <AssessmentChart data={mockWeeklyAssessments} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Triage Distribution</CardTitle>
            <CardDescription>Current triage category breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <TriageDistributionChart data={triageDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Cases & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
            <CardDescription>Cases awaiting facility care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(assessments ?? []).slice(0, 5).map(caseItem => (
                <div key={caseItem.id} className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{caseItem.childName}</p>
                    <p className="text-xs text-muted-foreground">{caseItem.village} • {caseItem.referralReason || caseItem.triageExplanation}</p>
                  </div>
                  <div className="text-right">
                    <CaseStatusWidget
                      case={{
                        id: caseItem.id,
                        patientName: caseItem.childName,
                        childId: caseItem.childId,
                        village: caseItem.village,
                        chvName: caseItem.chvName || "Unknown CHV",
                        triageCategory: triageCategoryMap[caseItem.triageCategory],
                        status: caseItem.referralFacilityName ? "referred" : "open",
                        createdAt: caseItem.createdAt,
                        lastUpdated: caseItem.createdAt,
                        referralFacility: caseItem.referralFacilityName,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>CHV performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Avg Assessments/CHV</p>
                <p className="text-2xl font-bold text-primary">4.2</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-xs text-muted-foreground mb-1">Response Time</p>
                <p className="text-2xl font-bold text-accent">2.1h</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <p className="text-xs text-muted-foreground mb-1">Referral Rate</p>
                <p className="text-2xl font-bold text-secondary">18%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
