'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/types';
import { UserCheck, LayoutDashboard, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const AfyaSignalLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pulse/ECG line in amber */}
    <path
      d="M 4 24 L 10 24 L 12 18 L 14 30 L 16 24 L 20 24 L 24 24 L 28 12 L 30 36 L 32 24 L 36 24"
      stroke="#F4A240"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Leaf shape in forest green at the end */}
    <g transform="translate(36, 24)">
      <path
        d="M 0 0 Q 3 -4 6 -6 Q 5 -2 6 2 Q 3 4 0 0 Z"
        fill="#1A6B4A"
      />
      <ellipse cx="3" cy="-2" rx="2" ry="3" fill="#1A6B4A" opacity="0.6" />
    </g>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("demo@afyasignal.com")
  const [password, setPassword] = useState("demo123")
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select your role to continue');
      return;
    }

    try {
      await login(email, password, selectedRole);
      
      // Role-based routing
      const routes: Record<UserRole, string> = {
        'chv': '/dashboard/chv',
        'admin': '/dashboard/admin',
        'health-facility': '/dashboard/facility',
      };
      
      router.push(routes[selectedRole]);
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AfyaSignalLogo />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AfyaSignal</h1>
          <p className="text-muted-foreground">Health Triage System</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">Select Your Role</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'chv' as const, label: 'CHV', Icon: UserCheck },
              { role: 'admin' as const, label: 'Admin', Icon: LayoutDashboard },
              { role: 'health-facility' as const, label: 'Facility', Icon: Building2 },
            ].map(({ role, label, Icon }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  selectedRole === role
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <Icon size={32} className="mb-2 text-primary" style={{ color: '#1A6B4A' }} />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !selectedRole}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Email: <span className="font-mono">demo@afyasignal.com</span></p>
                <p>Password: <span className="font-mono">demo123</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          AfyaSignal © 2026 | Community Health System
        </p>
      </div>
    </main>
  );
}
