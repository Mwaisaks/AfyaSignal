'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentForm } from '@/components/assessment-form';
import type { Assessment } from '@/lib/types';

export default function CHVDashboard() {
  const { user } = useAuth();
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [completedAssessments, setCompletedAssessments] = useState<Assessment[]>([]);

  const handleAssessmentSubmit = (assessment: Omit<Assessment, 'id' | 'timestamp' | 'chvId' | 'chvName'>) => {
    const newAssessment: Assessment = {
      ...assessment,
      id: `assessment-${Date.now()}`,
      timestamp: new Date().toISOString(),
      chvId: user!.id,
      chvName: user!.name,
    };
    setCompletedAssessments(prev => [newAssessment, ...prev]);
    setShowAssessmentForm(false);
  };

  if (!user || user.role !== 'chv') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">
          {user.village ? `Community Health Volunteer • ${user.village}` : 'Community Health Volunteer'}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Section - Takes full width on mobile, 2 cols on larger screens */}
        <div className="lg:col-span-2">
          {!showAssessmentForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Conduct Assessment</CardTitle>
                <CardDescription>Register and assess a child in your community</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Use this form to perform a comprehensive health assessment of a child. The system will help you determine the appropriate triage category and any necessary referrals.
                </p>
                <Button
                  onClick={() => setShowAssessmentForm(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start New Assessment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AssessmentForm
              onSubmit={handleAssessmentSubmit}
              onCancel={() => setShowAssessmentForm(false)}
              chvName={user.name}
              chvId={user.id}
            />
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today&apos;s Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">Assessments Today</p>
                <p className="text-2xl font-bold text-primary">{completedAssessments.length}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-xs text-muted-foreground">Referrals Made</p>
                <p className="text-2xl font-bold text-accent">0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                View Past Assessments
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                My Referrals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Assessments */}
      {completedAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Assessments you have completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedAssessments.map(assessment => (
                <div key={assessment.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{assessment.patientInfo.childName}</p>
                      <p className="text-xs text-muted-foreground">{assessment.patientInfo.childId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      assessment.status === 'completed' 
                        ? 'bg-accent/20 text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {assessment.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Age: {assessment.patientInfo.age} {assessment.patientInfo.ageUnit}</p>
                    <p>Symptoms: {Object.values(assessment.symptoms).filter(v => v === true).length} reported</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
