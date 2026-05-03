"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiRequest, type AssessmentRequest, type AssessmentResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssessmentForm } from "@/components/assessment-form";
import type { Assessment } from "@/lib/types";

export default function CHVDashboard() {
  const { user } = useAuth();
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [completedAssessments, setCompletedAssessments] = useState<AssessmentResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "chv") return;

    apiRequest<AssessmentResponse[]>("/api/assessments/my")
      .then(setCompletedAssessments)
      .catch(() => setError("Unable to load your assessments."));
  }, [user]);

  const handleAssessmentSubmit = async (assessment: Omit<Assessment, "id" | "timestamp" | "chvId" | "chvName">) => {
    setError("");

    const ageMonths = assessment.patientInfo.ageUnit === "years"
      ? assessment.patientInfo.age * 12
      : assessment.patientInfo.age;

    const payload: AssessmentRequest = {
      childName: assessment.patientInfo.childName,
      ageMonths,
      parentName: assessment.patientInfo.parentName,
      parentPhone: assessment.patientInfo.parentPhone,
      village: assessment.patientInfo.village,
      weight: assessment.vitals.weight,
      fever: assessment.symptoms.fever,
      feverDays: assessment.symptoms.feverDays,
      cough: assessment.symptoms.cough,
      coughDays: assessment.symptoms.coughDays,
      diarrhea: assessment.symptoms.diarrhea,
      diarrheaDays: assessment.symptoms.diarrheaDays,
      difficultyBreathing: assessment.symptoms.difficulty_breathing,
      rash: assessment.symptoms.rash,
      vomiting: assessment.symptoms.vomiting,
      lethargy: assessment.symptoms.lethargy,
      seizures: assessment.symptoms.seizures,
      otherSymptoms: assessment.symptoms.other,
      temperature: assessment.vitals.temperature,
      respiratoryRate: assessment.vitals.respiratory_rate,
    };

    try {
      const saved = await apiRequest<AssessmentResponse>("/api/assessments", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setCompletedAssessments(prev => [saved, ...prev]);
      setShowAssessmentForm(false);
    } catch {
      setError("Unable to submit assessment. Please check the fields and try again.");
    }
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

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/40 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

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
                      <p className="font-semibold text-foreground">{assessment.childName}</p>
                      <p className="text-xs text-muted-foreground">{assessment.childId}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent-foreground">
                      {assessment.triageCategory}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Age: {assessment.ageMonths} months</p>
                    <p>Village: {assessment.village}</p>
                    {assessment.triageExplanation && <p>{assessment.triageExplanation}</p>}
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
