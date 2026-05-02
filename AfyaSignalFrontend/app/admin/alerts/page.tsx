'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAlerts } from '@/lib/mockData';
import type { Alert } from '@/lib/types';

export default function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'new' | 'acknowledged' | 'resolved'>('all');

  if (!user || user.role !== 'admin') {
    return null;
  }

  const filtered = alerts.filter(a => filter === 'all' || a.status === filter);

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
  };

  const handleResolve = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
  };

  const severityColors = {
    critical: 'text-red-700 bg-red-100 border-red-200',
    high: 'text-orange-700 bg-orange-100 border-orange-200',
    medium: 'text-yellow-700 bg-yellow-100 border-yellow-200',
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    acknowledged: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
  };

  const typeLabels = {
    emergency: '🚨 Emergency',
    urgent: '⚠️ Urgent',
    'referral-pending': '📋 Referral Pending',
    'follow-up-due': '📅 Follow-up Due',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Alerts</h1>
          <p className="text-muted-foreground">Monitor critical events and notifications</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'new', 'acknowledged', 'resolved'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-border'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {' '}
            ({alerts.filter(a => status === 'all' || a.status === status).length})
          </button>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-muted-foreground">No alerts found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filtered.map(alert => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.severity === 'critical'
                ? 'border-l-red-500'
                : alert.severity === 'high'
                ? 'border-l-orange-500'
                : 'border-l-yellow-500'
            }`}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                  {/* Alert Info */}
                  <div className="md:col-span-3">
                    <div className="flex items-start gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{alert.patientName}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Case ID: <span className="font-mono text-foreground">{alert.caseId}</span></p>
                      <p>Created: {new Date(alert.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Severity & Type */}
                  <div className="md:col-span-2 space-y-2">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        severityColors[alert.severity]
                      }`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-muted text-muted-foreground">
                        {typeLabels[alert.type]}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        statusColors[alert.status]
                      }`}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex gap-2">
                    {alert.status === 'new' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                        className="flex-1"
                      >
                        Acknowledge
                      </Button>
                    )}
                    {alert.status !== 'resolved' && (
                      <Button
                        size="sm"
                        onClick={() => handleResolve(alert.id)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{alerts.filter(a => a.severity === 'critical').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{alerts.filter(a => a.status === 'new').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.status === 'resolved').length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
