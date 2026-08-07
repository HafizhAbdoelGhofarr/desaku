"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type AuthUser, type Role, getSession, setSession, clearSession, mockLogin, getRoleDashboard } from "../auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session.user);
    setLoading(false);
  }, []);

  const login = useCallback(async (role: Role) => {
    setLoading(true);
    const { token, user: u } = await mockLogin(role);
    setSession(token, u);
    setUser(u);
    setLoading(false);
    router.push(getRoleDashboard(role));
  }, [router]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
