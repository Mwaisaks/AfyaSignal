'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiRequest, type AlertResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const alertFilters = ['all', 'new', 'acknowledged', 'resolved'] as const;

export default function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'acknowledged' | 'resolved'>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    apiRequest<AlertResponse[]>('/api/alerts')
      .then(setAlerts)
      .catch(() => setError('Unable to load alerts.'));
  }, [user]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const filtered = alerts.filter(a => filter === 'all' || a.status.toLowerCase() === filter);

  const handleAcknowledge = async (id: string) => {
    const updated = await apiRequest<AlertResponse>(`/api/alerts/${id}/acknowledge`, {
      method: 'PATCH',
    });
    setAlerts(alerts.map(a => a.id === id ? updated : a));
  };

  const statusColors = {
    NEW: 'bg-blue-100 text-blue-700',
    ACKNOWLEDGED: 'bg-yellow-100 text-yellow-700',
    RESOLVED: 'bg-green-100 text-green-700',
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

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/40 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {alertFilters.map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-border'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {' '}
            ({alerts.filter(a => status === 'all' || a.status.toLowerCase() === status).length})
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
              alert.status === 'NEW'
                ? 'border-l-red-500'
                : alert.status === 'ACKNOWLEDGED'
                ? 'border-l-orange-500'
                : 'border-l-yellow-500'
            }`}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                  {/* Alert Info */}
                  <div className="md:col-span-3">
                    <div className="flex items-start gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{alert.village}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Cases: <span className="font-mono text-foreground">{alert.caseCount || 0}</span></p>
                      <p>Created: {new Date(alert.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Severity & Type */}
                  <div className="md:col-span-2 space-y-2">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        alert.status === 'NEW' ? 'text-red-700 bg-red-100 border-red-200' : 'text-orange-700 bg-orange-100 border-orange-200'
                      }`}>
                        {alert.status === 'NEW' ? 'Needs Review' : 'Reviewed'}
                      </span>
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-muted text-muted-foreground">
                        {alert.type}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        statusColors[alert.status]
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex gap-2">
                    {alert.status === 'NEW' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                        className="flex-1"
                      >
                        Acknowledge
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
            <p className="text-2xl font-bold text-red-600">{alerts.filter(a => a.status === 'NEW').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{alerts.filter(a => a.status === 'NEW').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.status === 'RESOLVED').length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
