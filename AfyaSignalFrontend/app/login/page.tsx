'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/types';
import { UserCheck, LayoutDashboard, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { ApiError } from '@/lib/api';

const AfyaSignalLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 4 24 L 10 24 L 12 18 L 14 30 L 16 24 L 20 24 L 24 24 L 28 12 L 30 36 L 32 24 L 36 24"
      stroke="#F4A240"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
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
  const [email, setEmail] = useState('admin@afyasignal.com');
  const [password, setPassword] = useState('demo123');
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

      const routes: Record<UserRole, string> = {
        chv: '/dashboard/chv',
        admin: '/dashboard/admin',
        'health-facility': '/dashboard/facility',
      };

      router.push(routes[selectedRole]);
    } catch (err) {
      const apiError = err as Partial<ApiError> | Error;
      setError('message' in apiError && apiError.message ? apiError.message : 'Login failed. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <AfyaSignalLogo />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">AfyaSignal</h1>
          <p className="text-muted-foreground">Health Triage System</p>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-foreground">Select Your Role</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'chv' as const, label: 'CHV', Icon: UserCheck },
              { role: 'admin' as const, label: 'Admin', Icon: LayoutDashboard },
              { role: 'health-facility' as const, label: 'Facility', Icon: Building2 },
            ].map(({ role, label, Icon }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                  selectedRole === role
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <Icon size={32} className="mb-2 text-primary" />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" disabled={isLoading || !selectedRole} className="w-full">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 rounded-lg bg-muted/30 p-4">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Admin: <span className="font-mono">admin@afyasignal.com</span></p>
                <p>CHV: <span className="font-mono">chv@afyasignal.com</span></p>
                <p>Facility: <span className="font-mono">facility@afyasignal.com</span></p>
                <p>Password: <span className="font-mono">demo123</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          AfyaSignal © 2026 | Community Health System
        </p>
      </div>
    </main>
  );
}
