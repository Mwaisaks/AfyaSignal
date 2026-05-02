'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockHealthFacilities } from '@/lib/mockData';

export default function FacilitiesPage() {
  const { user } = useAuth();

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockHealthFacilities.map(facility => (
          <Card key={facility.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{facility.name}</CardTitle>
              <CardDescription>{facility.village}, {facility.district}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-1">PHONE</p>
                  <a href={`tel:${facility.phone}`} className="text-sm text-primary hover:underline font-mono">
                    {facility.phone}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-1">CAPACITY</p>
                  <p className="text-sm font-semibold text-foreground">{facility.capacity} beds</p>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground font-semibold mb-2">CURRENT OCCUPANCY</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(facility.currentPatients / facility.capacity) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {facility.currentPatients}/{facility.capacity}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">AVAILABILITY</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    facility.currentPatients < facility.capacity * 0.8
                      ? 'bg-green-500'
                      : facility.currentPatients < facility.capacity * 0.95
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-semibold text-foreground">
                    {facility.currentPatients < facility.capacity * 0.8
                      ? 'Available'
                      : facility.currentPatients < facility.capacity * 0.95
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
        ))}
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
              <p className="text-sm text-red-700">{mockHealthFacilities[3].name}</p>
              <a href={`tel:${mockHealthFacilities[3].phone}`} className="text-sm text-red-600 hover:underline font-mono">
                {mockHealthFacilities[3].phone}
              </a>
            </div>
            
            <div className="p-3 border-l-4 border-primary bg-primary/5 rounded">
              <p className="font-semibold text-primary">Primary Referral</p>
              <p className="text-sm text-primary/80">{mockHealthFacilities[0].name}</p>
              <a href={`tel:${mockHealthFacilities[0].phone}`} className="text-sm text-primary hover:underline font-mono">
                {mockHealthFacilities[0].phone}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
