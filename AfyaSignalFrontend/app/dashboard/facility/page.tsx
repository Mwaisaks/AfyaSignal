"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiRequest, type AssessmentResponse } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FacilityDashboard() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<AssessmentResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "health-facility") return;

    apiRequest<AssessmentResponse[]>("/api/assessments/emergency")
      .then(setReferrals)
      .catch(() => setError("Unable to load incoming referrals."));
  }, [user]);

  if (!user || user.role !== 'health-facility') {
    return null;
  }

  const incomingReferrals = referrals.length;
  const criticalCases = referrals.filter(r => r.triageCategory === "EMERGENCY").length;
  const completedCases = 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">
          {user.facility ? `${user.facility} • Facility Manager` : 'Facility Manager'}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/40 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incoming Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{incomingReferrals}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting arrival</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{criticalCases}</p>
            <p className="text-xs text-muted-foreground mt-1">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{completedCases}</p>
            <p className="text-xs text-muted-foreground mt-1">Treated & discharged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-secondary">68%</p>
            <p className="text-xs text-muted-foreground mt-1">Current capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Incoming Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Incoming Referrals</CardTitle>
          <CardDescription>Referred cases requiring facility care</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Case ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Child Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Age</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Risk Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">CHV</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Village</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Referred At</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {(referrals ?? []).map(referral => (
                  <tr key={referral.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-foreground">{referral.childId}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{referral.childName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{referral.ageMonths} mo</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        referral.triageCategory === 'EMERGENCY' ? 'bg-red-100 text-red-900' :
                        referral.triageCategory === 'URGENT' ? 'bg-orange-100 text-orange-900' :
                        'bg-green-100 text-green-900'
                      }`}>
                        {referral.triageCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{referral.chvName || 'Unknown CHV'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{referral.village}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{new Date(referral.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-900">
                        Awaiting Review
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-muted-foreground">{referral.referralReason || 'Referral required'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Facility Info */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Information</CardTitle>
          <CardDescription>Your facility details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Facility Name</p>
              <p className="font-semibold text-foreground">{user.facility || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Beds</p>
              <p className="font-semibold text-foreground">45</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Available Staff</p>
              <p className="font-semibold text-foreground">8 Clinical Officers</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Operating Hours</p>
              <p className="font-semibold text-foreground">24/7</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
