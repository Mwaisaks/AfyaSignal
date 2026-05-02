'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TriageCategory } from '@/lib/types';

interface TriageResultProps {
  category: TriageCategory;
  patientName: string;
  recommendations: string[];
  referral?: {
    facility: string;
    reason: string;
    urgency: 'immediate' | 'same-day' | 'next-appointment';
  };
  onClose: () => void;
  onPrintReferral?: () => void;
}

const categoryConfig = {
  emergency: {
    color: 'text-white',
    bgColor: 'bg-red-600',
    icon: '🚨',
    title: 'EMERGENCY',
    description: 'Immediate referral to hospital required',
    borderColor: 'border-red-200',
    bgLight: 'bg-red-50',
  },
  urgent: {
    color: 'text-white',
    bgColor: 'bg-orange-600',
    icon: '⚠️',
    title: 'URGENT',
    description: 'Same-day referral to health facility required',
    borderColor: 'border-orange-200',
    bgLight: 'bg-orange-50',
  },
  priority: {
    color: 'text-white',
    bgColor: 'bg-primary',
    icon: '🔍',
    title: 'PRIORITY',
    description: 'Health facility visit recommended',
    borderColor: 'border-primary/20',
    bgLight: 'bg-primary/10',
  },
  general: {
    color: 'text-white',
    bgColor: 'bg-accent',
    icon: '✓',
    title: 'GENERAL',
    description: 'Home care with follow-up',
    borderColor: 'border-accent/20',
    bgLight: 'bg-accent/10',
  },
};

export function TriageResult({
  category,
  patientName,
  recommendations,
  referral,
  onClose,
  onPrintReferral,
}: TriageResultProps) {
  const config = categoryConfig[category];

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className="border-2" style={{ borderColor: config.bgColor.split('-')[1] }}>
        <CardHeader className={`${config.bgColor} ${config.color} rounded-t-lg`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{config.icon}</span>
            <CardTitle className={config.color}>{config.title}</CardTitle>
          </div>
          <p className={`${config.color} opacity-90`}>{config.description}</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">PATIENT</p>
            <p className="text-lg font-bold text-foreground">{patientName}</p>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Recommended Actions</h3>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                  <span className="text-primary font-bold flex-shrink-0">•</span>
                  <p className="text-sm text-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Information */}
          {referral && (
            <div className={`p-4 border-2 rounded-lg mb-6 ${config.borderColor} ${config.bgLight}`}>
              <h4 className="font-semibold text-foreground mb-3">Referral Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">FACILITY</p>
                  <p className="text-foreground font-semibold">{referral.facility}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">REASON FOR REFERRAL</p>
                  <p className="text-foreground">{referral.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">URGENCY</p>
                  <p className="text-foreground capitalize font-semibold">
                    {referral.urgency === 'immediate'
                      ? '🚑 Immediate'
                      : referral.urgency === 'same-day'
                      ? '⏰ Same Day'
                      : '📅 Next Appointment'}
                  </p>
                </div>
              </div>

              {onPrintReferral && (
                <Button
                  onClick={onPrintReferral}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Print Referral Form
                </Button>
              )}
            </div>
          )}

          {/* Next Steps */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-6">
            <h4 className="font-semibold text-foreground mb-2">Next Steps</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {category === 'emergency' && (
                <>
                  <li>• Immediately contact the health facility</li>
                  <li>• Prepare the child for transport to hospital</li>
                  <li>• Contact parent/guardian without delay</li>
                </>
              )}
              {category === 'urgent' && (
                <>
                  <li>• Contact the health facility to arrange appointment</li>
                  <li>• Provide referral slip to parent/guardian</li>
                  <li>• Follow up within 24 hours</li>
                </>
              )}
              {category === 'priority' && (
                <>
                  <li>• Schedule health facility visit</li>
                  <li>• Provide care instructions to parent/guardian</li>
                  <li>• Follow up within 3-5 days</li>
                </>
              )}
              {category === 'general' && (
                <>
                  <li>• Provide home care advice</li>
                  <li>• Schedule follow-up visit</li>
                  <li>• Monitor child&apos;s condition</li>
                </>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              New Assessment
            </Button>
            <Button
              variant="outline"
              className="flex-1"
            >
              Save Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
