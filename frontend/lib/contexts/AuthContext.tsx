"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type AuthUser, type Role, getSession, setSession, clearSession, mockLogin, getRoleDashboard } from "../auth";
import { api } from "../api";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (role: Role, villageId?: string, villageName?: string, email?: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  // Restore user session on client after mount (avoids hydration mismatch)
  useEffect(() => {
    const session = getSession();
    if (session?.user) {
      setUser(session.user);
    }
  }, []);

  const login = useCallback(async (role: Role, villageId?: string, villageName?: string, email?: string, password?: string) => {
    setLoading(true);
    try {
      // Try live FastAPI login if credentials match
      const username = role === "admin" || role === "dpmd" ? "admin" : "operator_sukamaju";
      const pwd = password || (role === "admin" ? "admin123" : "desa123");
      
      const res = await api.auth.login(username, pwd).catch(() => null);
      if (res && res.access_token) {
        const u: AuthUser = {
          id: role === "admin" ? "u1" : "u2",
          name: role === "admin" ? "Budi Santoso (Admin DPMD)" : `Operator ${villageName || "Desa Sukamaju"}`,
          email: email || (role === "admin" ? "admin@dpmd.go.id" : "operator@desa.id"),
          role,
          village: villageName || (role === "desa" ? "Desa Sukamaju" : undefined),
          villageId: villageId || (role === "desa" ? "v1" : undefined),
        };
        setSession(res.access_token, u);
        setUser(u);
        setLoading(false);
        router.push(getRoleDashboard(role));
        return;
      }
    } catch {
      // Silent fallback
    }

    // Fallback to local session
    const { token, user: u } = await mockLogin(role, villageId, villageName, email);
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
