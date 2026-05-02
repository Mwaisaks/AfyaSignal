'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCases, mockAlerts, mockDashboardStats, mockWeeklyAssessments, mockTriageDistribution, mockCHVs } from '@/lib/mockData';
import { AssessmentChart } from '@/components/charts/assessment-chart';
import { TriageDistributionChart } from '@/components/charts/triage-distribution-chart';
import { CaseStatusWidget } from '@/components/case-status-widget';

export default function AdminPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  const stats = mockDashboardStats;
  const emergencyCases = mockCases.filter(c => c.triageCategory === 'emergency');
  const urgentCases = mockCases.filter(c => c.triageCategory === 'urgent');
  const newAlerts = mockAlerts.filter(a => a.status === 'new');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
        <h1 className="text-2xl font-bold text-foreground mb-2">System Overview</h1>
        <p className="text-muted-foreground">Monitor health assessments, referrals, and community health volunteer activity</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalAssessments}</div>
            <p className="text-xs text-accent mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Emergency Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.emergencyCases}</div>
            <p className="text-xs text-red-600 mt-1">Require immediate action</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Urgent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.urgentCases}</div>
            <p className="text-xs text-orange-600 mt-1">Same-day referral needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active CHVs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.activeCHVs}</div>
            <p className="text-xs text-primary mt-1">Community volunteers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Assessment Trend</CardTitle>
            <CardDescription>Assessments and referrals by day</CardDescription>
          </CardHeader>
          <CardContent>
            <AssessmentChart data={mockWeeklyAssessments} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Triage Distribution</CardTitle>
            <CardDescription>Cases by severity category</CardDescription>
          </CardHeader>
          <CardContent>
            <TriageDistributionChart data={mockTriageDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Cases and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency & Urgent Cases */}
        <Card>
          <CardHeader>
            <CardTitle>Active High-Priority Cases</CardTitle>
            <CardDescription>Emergency and urgent cases requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyCases.length === 0 && urgentCases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active high-priority cases</p>
            ) : (
              <>
                {emergencyCases.map(c => (
                  <CaseStatusWidget key={c.id} case={c} />
                ))}
                {urgentCases.map(c => (
                  <CaseStatusWidget key={c.id} case={c} />
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>{newAlerts.length} new alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {newAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No new alerts</p>
            ) : (
              newAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="p-3 border border-border rounded-lg hover:bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{alert.patientName}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
                      alert.severity === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : alert.severity === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* CHV Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle>CHV Team</CardTitle>
          <CardDescription>Active community health volunteers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockCHVs.map(chv => (
              <div key={chv.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="mb-3">
                  <p className="font-semibold text-foreground">{chv.name}</p>
                  <p className="text-xs text-muted-foreground">{chv.village}</p>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Phone:</span> {chv.phone}
                  </p>
                  <div className="pt-2 border-t border-border">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <Card>
        <CardHeader>
          <CardTitle>All Cases</CardTitle>
          <CardDescription>Tracked cases from community assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Patient</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Child ID</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Village</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">CHV</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Category</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockCases.map(c => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-2 px-2 font-medium text-foreground">{c.patientName}</td>
                    <td className="py-2 px-2 text-muted-foreground">{c.childId}</td>
                    <td className="py-2 px-2 text-muted-foreground">{c.village}</td>
                    <td className="py-2 px-2 text-muted-foreground">{c.chvName}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        c.triageCategory === 'emergency'
                          ? 'bg-red-100 text-red-700'
                          : c.triageCategory === 'urgent'
                          ? 'bg-orange-100 text-orange-700'
                          : c.triageCategory === 'priority'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {c.triageCategory}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        c.status === 'referred'
                          ? 'bg-blue-100 text-blue-700'
                          : c.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
