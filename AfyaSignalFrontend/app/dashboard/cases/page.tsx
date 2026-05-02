'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockCases } from '@/lib/mockData';
import type { TriageCategory } from '@/lib/types';

export default function CasesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<TriageCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'referred' | 'completed'>('all');

  if (!user || user.role !== 'chv') {
    return null;
  }

  const myCases = mockCases.filter(c => c.chvName === user.name);

  const filtered = myCases.filter(c => {
    const matchesSearch = c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.childId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || c.triageCategory === filterCategory;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categoryColors: Record<TriageCategory, string> = {
    emergency: 'bg-red-100 text-red-700',
    urgent: 'bg-orange-100 text-orange-700',
    priority: 'bg-primary/10 text-primary',
    general: 'bg-accent/10 text-accent',
  };

  const statusColors: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-700',
    referred: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    'lost-to-follow-up': 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Cases</h1>
          <p className="text-muted-foreground">Manage all your patient assessments and referrals</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Search</label>
              <Input
                placeholder="Patient name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input"
              >
                <option value="all">All Categories</option>
                <option value="emergency">Emergency</option>
                <option value="urgent">Urgent</option>
                <option value="priority">Priority</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="referred">Referred</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterStatus('all');
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>{filtered.length} Cases Found</CardTitle>
          <CardDescription>Total cases from your assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No cases found matching your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(c => (
                <div
                  key={c.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="font-semibold text-foreground">{c.patientName}</p>
                      <p className="text-xs text-muted-foreground">{c.childId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{c.village}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        categoryColors[c.triageCategory]
                      }`}>
                        {c.triageCategory}
                      </span>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[c.status]
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground text-right">
                      {c.referralFacility && (
                        <p>{c.referralFacility}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{myCases.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emergency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{myCases.filter(c => c.triageCategory === 'emergency').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Referred</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{myCases.filter(c => c.status === 'referred').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{myCases.filter(c => c.status === 'completed').length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
