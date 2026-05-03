"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, UserRole } from "./types";
import { loginRequest, mapBackendRole } from "./api";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("afyasignal_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const auth = await loginRequest(email, password);
      const backendRole = mapBackendRole(auth.role);

      if (backendRole !== role) {
        throw new Error(`This account is registered as ${backendRole}. Select the matching role.`);
      }

      const authenticatedUser: User = {
        id: auth.id,
        name: auth.name,
        role: backendRole,
        email: auth.email,
        village: auth.village || undefined,
        facility: auth.facility || undefined,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(auth.name)}`,
      };

      localStorage.setItem("afyasignal_token", auth.token);
      localStorage.setItem("afyasignal_user", JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("afyasignal_token");
    localStorage.removeItem("afyasignal_user");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
