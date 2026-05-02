'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TriageData {
  category: string;
  value: number;
  color: string;
}

interface TriageDistributionChartProps {
  data: TriageData[];
}

export function TriageDistributionChart({ data }: TriageDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ category, value }) => `${category}: ${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))',
          }}
          formatter={(value) => `${value} cases`}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '16px' }}
          formatter={(value, props) => (
            <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
