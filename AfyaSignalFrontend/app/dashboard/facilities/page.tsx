'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiRequest, type FacilityResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FacilitiesPage() {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState<FacilityResponse[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    apiRequest<FacilityResponse[]>('/api/facilities')
      .then(setFacilities)
      .catch(() => setError('Unable to load facilities.'));
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Facilities</h1>
          <p className="text-muted-foreground">Referral destinations and contact information</p>
        </div>
        <Link href={user.role === 'chv' ? '/dashboard' : '/admin'}>
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/40 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map(facility => {
          const totalBeds = facility.totalBeds || 0;
          const availableBeds = facility.availableBeds || 0;
          const currentPatients = Math.max(totalBeds - availableBeds, 0);
          const occupancy = totalBeds > 0 ? (currentPatients / totalBeds) * 100 : 0;

          return (
          <Card key={facility.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{facility.name}</CardTitle>
              <CardDescription>{facility.village}, {facility.subCounty}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-1">PHONE</p>
                  <a href={`tel:${facility.phone}`} className="text-sm text-primary hover:underline font-mono">
                    {facility.phone || 'Not listed'}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-1">CAPACITY</p>
                  <p className="text-sm font-semibold text-foreground">{totalBeds || 'Unknown'} beds</p>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground font-semibold mb-2">CURRENT OCCUPANCY</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {currentPatients}/{totalBeds || 0}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">AVAILABILITY</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    occupancy < 80
                      ? 'bg-green-500'
                      : occupancy < 95
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-semibold text-foreground">
                    {occupancy < 80
                      ? 'Available'
                      : occupancy < 95
                      ? 'Limited Availability'
                      : 'Near Capacity'}
                  </span>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Directions
              </Button>
            </CardContent>
          </Card>
        )})}
      </div>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>Critical contacts for urgent situations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-red-500 bg-red-50 rounded">
              <p className="font-semibold text-red-900">Emergency Hospital</p>
              <p className="text-sm text-red-700">{facilities[0]?.name || 'No facility loaded'}</p>
              <a href={`tel:${facilities[0]?.phone || ''}`} className="text-sm text-red-600 hover:underline font-mono">
                {facilities[0]?.phone || 'Not listed'}
              </a>
            </div>
            
            <div className="p-3 border-l-4 border-primary bg-primary/5 rounded">
              <p className="font-semibold text-primary">Primary Referral</p>
              <p className="text-sm text-primary/80">{facilities[1]?.name || facilities[0]?.name || 'No facility loaded'}</p>
              <a href={`tel:${facilities[1]?.phone || facilities[0]?.phone || ''}`} className="text-sm text-primary hover:underline font-mono">
                {facilities[1]?.phone || facilities[0]?.phone || 'Not listed'}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
