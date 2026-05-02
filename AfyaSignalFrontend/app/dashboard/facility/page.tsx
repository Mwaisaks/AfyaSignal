'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface Referral {
  caseId: string;
  childName: string;
  age: number;
  riskLevel: 'LOW' | 'MODERATE' | 'CRITICAL';
  chvName: string;
  village: string;
  referredAt: string;
  status: 'Awaiting Arrival' | 'Admitted' | 'Treated & Discharged';
}

// Mock referral data
const mockReferrals: Referral[] = [
  {
    caseId: 'CHILD-2026-0001',
    childName: 'Amara Kipchoge',
    age: 18,
    riskLevel: 'CRITICAL',
    chvName: 'Grace Mwangi',
    village: 'Kibera',
    referredAt: '2026-05-02 10:30',
    status: 'Awaiting Arrival',
  },
  {
    caseId: 'CHILD-2026-0042',
    childName: 'David Kiplagat',
    age: 24,
    riskLevel: 'MODERATE',
    chvName: 'Samuel Kiplagat',
    village: 'Mathare',
    referredAt: '2026-05-02 09:15',
    status: 'Admitted',
  },
  {
    caseId: 'CHILD-2026-0089',
    childName: 'Zainab Mwangi',
    age: 12,
    riskLevel: 'CRITICAL',
    chvName: 'Peter Ochieng',
    village: 'Kibera',
    referredAt: '2026-05-01 16:45',
    status: 'Admitted',
  },
  {
    caseId: 'CHILD-2026-0056',
    childName: 'Joseph Kipkemboi',
    age: 30,
    riskLevel: 'LOW',
    chvName: 'Elizabeth Kipchoge',
    village: 'Mukuru',
    referredAt: '2026-05-01 14:20',
    status: 'Treated & Discharged',
  },
  {
    caseId: 'CHILD-2026-0123',
    childName: 'Fatima Hassan',
    age: 8,
    riskLevel: 'MODERATE',
    chvName: 'Rose Mwangi',
    village: 'Mathare',
    referredAt: '2026-04-30 11:00',
    status: 'Treated & Discharged',
  },
];

export default function FacilityDashboard() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (!user || user.role !== 'health-facility') {
    return null;
  }

  const incomingReferrals = referrals.filter(r => r.status === 'Awaiting Arrival').length;
  const criticalCases = referrals.filter(r => r.riskLevel === 'CRITICAL').length;
  const completedCases = referrals.filter(r => r.status === 'Treated & Discharged').length;

  const handleStatusChange = (caseId: string, newStatus: Referral['status']) => {
    setReferrals(referrals.map(r => r.caseId === caseId ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">
          {user.facility ? `${user.facility} • Facility Manager` : 'Facility Manager'}
        </p>
      </div>

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
                  <tr key={referral.caseId} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-foreground">{referral.caseId}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{referral.childName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{referral.age} mo</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        referral.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-900' :
                        referral.riskLevel === 'MODERATE' ? 'bg-orange-100 text-orange-900' :
                        'bg-green-100 text-green-900'
                      }`}>
                        {referral.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{referral.chvName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{referral.village}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{referral.referredAt}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        referral.status === 'Awaiting Arrival' ? 'bg-yellow-100 text-yellow-900' :
                        referral.status === 'Admitted' ? 'bg-blue-100 text-blue-900' :
                        'bg-green-100 text-green-900'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative group">
                        <button className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-semibold">
                          Update <ChevronDown size={16} />
                        </button>
                        <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                          {['Awaiting Arrival', 'Admitted', 'Treated & Discharged'].map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(referral.caseId, status as Referral['status'])}
                              className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                                referral.status === status ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
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
