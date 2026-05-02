'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentChart } from '@/components/charts/assessment-chart';
import { TriageDistributionChart } from '@/components/charts/triage-distribution-chart';
import { CaseStatusWidget } from '@/components/case-status-widget';
import { mockWeeklyAssessments, mockCases, mockAlerts, mockDashboardStats, mockCHVs, mockTriageDistribution } from '@/lib/mockData';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  const totalAssessments = mockDashboardStats.totalAssessments;
  const activeCases = mockCases.filter(c => c.status === 'open').length;
  const pendingAlerts = mockAlerts.filter(a => a.status === 'new').length;
  const totalChvs = mockCHVs.length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">System Administrator Dashboard</p>
      </div>

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
            <TriageDistributionChart data={mockTriageDistribution} />
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
              {(mockCases ?? []).slice(0, 5).map(caseItem => (
                <div key={caseItem.id} className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{caseItem.childName}</p>
                    <p className="text-xs text-muted-foreground">{caseItem.referralReason}</p>
                  </div>
                  <div className="text-right">
                    <CaseStatusWidget status={caseItem.status} triageLevel={caseItem.triageLevel} />
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
