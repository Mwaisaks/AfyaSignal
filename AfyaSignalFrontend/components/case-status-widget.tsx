'use client';

import type { Case } from '@/lib/types';

interface CaseStatusWidgetProps {
  case: Case;
}

export function CaseStatusWidget({ case: c }: CaseStatusWidgetProps) {
  const categoryColors: Record<string, string> = {
    critical:  'bg-red-100 text-red-700 border-red-200',
    moderate:  'bg-orange-100 text-orange-700 border-orange-200',
    low:       'bg-primary/10 text-primary border-primary/20',
    emergency: 'bg-red-100 text-red-700 border-red-200',
    urgent:    'bg-orange-100 text-orange-700 border-orange-200',
    priority:  'bg-primary/10 text-primary border-primary/20',
    general:   'bg-accent/10 text-accent border-accent/20',
  };

  const level = c?.triageCategory ?? 'general';
  const colorClass = categoryColors[level] ?? categoryColors['low'];
  const label = level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <div className={`p-3 border-2 rounded-lg ${colorClass}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm">{c?.patientName ?? '—'}</p>
          <p className="text-xs opacity-75">{c?.childId ?? '—'}</p>
        </div>
        <span className="px-2 py-1 rounded text-xs font-semibold bg-white/50">
          {label}
        </span>
      </div>
      <div className="text-xs space-y-1 opacity-75">
        <p><span className="font-semibold">CHV:</span> {c?.chvName ?? '—'}</p>
        {c?.referralFacility && (
          <p><span className="font-semibold">Referred to:</span> {c.referralFacility}</p>
        )}
      </div>
    </div>
  );
}