'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AssessmentData {
  day: string;
  assessments: number;
  referrals: number;
}

interface AssessmentChartProps {
  data: AssessmentData[];
}

export function AssessmentChart({ data }: AssessmentChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          cursor={{ fill: 'hsl(var(--primary)/0.1)' }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '16px' }}
          formatter={(value) => (
            <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
          )}
        />
        <Bar dataKey="assessments" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        <Bar dataKey="referrals" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
