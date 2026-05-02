'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would authenticate with your backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data based on role
      const mockUsers: Record<UserRole, User> = {
        chv: {
          id: 'user-chv-001',
          name: 'Grace Mwangi',
          role: 'chv',
          email: email,
          phone: '+254712345690',
          village: 'Kibera',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
        },
        admin: {
          id: 'user-admin-001',
          name: 'Admin User',
          role: 'admin',
          email: email,
          phone: '+254712345600',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        },
        'health-facility': {
          id: 'user-hf-001',
          name: 'Health Facility Manager',
          role: 'health-facility',
          email: email,
          facility: 'Kibera Health Center',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Facility',
        },
      };

      setUser(mockUsers[role]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
