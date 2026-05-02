import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <h1 className="font-bold text-foreground">AfyaSignal</h1>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Login</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            AfyaSignal: Health Triage for Communities
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering community health volunteers to deliver faster, more accurate triage and save lives in Sub-Saharan Africa
          </p>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>About AfyaSignal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              AfyaSignal is a comprehensive health triage and referral management system designed specifically for community health workers in resource-limited settings. By providing accessible, evidence-based triage guidance at the point of care, we help ensure that children receive appropriate care at the right facility.
            </p>
            <p className="text-muted-foreground">
              The system integrates community health volunteers (CHVs) with health facility networks, enabling rapid assessment, appropriate referral, and follow-up tracking to improve health outcomes.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Rapid Assessment',
                description: 'Quick, structured assessment forms capturing key vital signs and symptoms'
              },
              {
                title: 'Evidence-Based Triage',
                description: 'WHO-aligned triage protocols ensuring appropriate care level recommendations'
              },
              {
                title: 'Facility Network',
                description: 'Integration with local health facilities for seamless referrals'
              },
              {
                title: 'Follow-up Tracking',
                description: 'Monitor case outcomes and ensure continuity of care'
              },
              {
                title: 'Analytics Dashboard',
                description: 'Real-time monitoring of health trends and system performance'
              },
              {
                title: 'Mobile-Ready Design',
                description: 'Works on basic smartphones in areas with limited connectivity'
              },
            ].map((feature, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <p className="font-semibold text-foreground mb-2">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Roles */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">System Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">CHV (Community Health Volunteer)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Conduct child assessments in the community</p>
                <p>• Input symptoms and vital signs</p>
                <p>• Receive triage recommendations</p>
                <p>• Manage referrals to health facilities</p>
                <p>• Track case follow-ups</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Facility Manager</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Receive referral notifications</p>
                <p>• Manage facility capacity</p>
                <p>• Track incoming referrals</p>
                <p>• Provide feedback on outcomes</p>
                <p>• Coordinate with CHVs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Administrator</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Monitor system-wide metrics</p>
                <p>• Track referral outcomes</p>
                <p>• Generate performance reports</p>
                <p>• Manage user accounts</p>
                <p>• Oversee quality metrics</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              AfyaSignal is built on the belief that better tools lead to better health outcomes. By bringing structured, evidence-based triage to the community level, we&apos;re helping ensure that every child gets the care they need, when they need it.
            </p>
            <p className="text-muted-foreground">
              For implementation inquiries or technical support, please contact our team.
            </p>
            <div className="pt-4 flex gap-3">
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">Back to Login</Button>
              </Link>
              <Button variant="outline">Contact Support</Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            AfyaSignal © 2026 | Community Health Triage System
          </p>
        </div>
      </div>
    </main>
  );
}
