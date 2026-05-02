'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TriageResult } from '@/components/triage-result';
import type { TriageCategory } from '@/lib/types';
import { mockHealthFacilities } from '@/lib/mockData';

export default function ResultsPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<TriageCategory | null>(null);

  if (!user || user.role !== 'chv') {
    return null;
  }

  const categories: { category: TriageCategory; label: string; description: string }[] = [
    {
      category: 'emergency',
      label: 'Emergency Case',
      description: 'Life-threatening condition requiring immediate hospital referral',
    },
    {
      category: 'urgent',
      label: 'Urgent Case',
      description: 'Serious condition requiring same-day facility visit',
    },
    {
      category: 'priority',
      label: 'Priority Case',
      description: 'Condition requiring facility assessment within 3-5 days',
    },
    {
      category: 'general',
      label: 'General Care',
      description: 'Stable condition manageable with home care and follow-up',
    },
  ];

  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div>
          <Link href="/dashboard">
            <Button variant="outline" className="mb-4">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Triage Results Examples</h1>
          <p className="text-muted-foreground">Select a triage category to view example results and recommendations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(({ category, label, description }) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <h3 className="font-semibold text-foreground mb-1">{label}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const recommendationsByCategory = {
    emergency: [
      'Immediate hospital referral required',
      'Call ambulance if available',
      'Do not delay transport',
      'Inform health facility of emergency referral',
      'Ensure parent/guardian accompanies child',
    ],
    urgent: [
      'Same-day referral to Kibera Health Center',
      'Contact facility to arrange urgent appointment',
      'Transport child within 4 hours',
      'Provide referral form to parent/guardian',
      'Follow up within 24 hours',
    ],
    priority: [
      'Schedule health facility visit within 3-5 days',
      'Provide home care instructions',
      'Monitor symptoms daily',
      'Contact facility for appointment',
      'Follow up to confirm visit',
    ],
    general: [
      'Home care management',
      'Ensure adequate hydration',
      'Monitor for worsening symptoms',
      'Encourage nutritious diet',
      'Schedule follow-up visit in 1-2 weeks',
    ],
  };

  const categoryReferrals = {
    emergency: {
      facility: mockHealthFacilities[3].name,
      reason: 'Severe respiratory distress with high fever',
      urgency: 'immediate' as const,
    },
    urgent: {
      facility: mockHealthFacilities[0].name,
      reason: 'Persistent high fever with difficulty breathing',
      urgency: 'same-day' as const,
    },
    priority: {
      facility: mockHealthFacilities[0].name,
      reason: 'Moderate symptoms requiring assessment',
      urgency: 'next-appointment' as const,
    },
    general: undefined,
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={() => setSelectedCategory(null)}
        variant="outline"
      >
        ← Back to Categories
      </Button>

      <TriageResult
        category={selectedCategory}
        patientName="Amara Kipchoge"
        recommendations={recommendationsByCategory[selectedCategory]}
        referral={categoryReferrals[selectedCategory]}
        onClose={() => setSelectedCategory(null)}
        onPrintReferral={() => window.print()}
      />
    </div>
  );
}
