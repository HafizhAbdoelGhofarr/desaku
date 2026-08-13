"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type AuthUser, type Role, getSession, setSession, clearSession, mockLogin, getRoleDashboard } from "../auth";
import { api } from "../api";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Derive username from email for FastAPI OAuth2 form login
      const username = email.split("@")[0];
      
      const res = await api.auth.login(username, password).catch(() => null);
      if (res && res.access_token) {
        // Store token temporarily to allow getMe to authenticate
        if (typeof window !== "undefined") {
          localStorage.setItem("sdk_auth_token", res.access_token);
        }

        // Fetch user profile from backend to determine role & village
        try {
          const me = await api.auth.getMe();
          // Map backend role to frontend Role type
          const role: Role = me.role === "pengelola_desa" ? "desa" : "admin";
          
          const u: AuthUser = {
            id: String(me.id),
            name: me.username,
            email: me.email,
            role,
            villageId: me.village_id ? String(me.village_id) : undefined,
          };
          setSession(res.access_token, u);
          setUser(u);
          setLoading(false);
          router.push(getRoleDashboard(role));
          return;
        } catch {
          // If getMe fails, fall through to mock
        }
      }
    } catch {
      // Silent fallback
    }

    // Fallback to local mock session — derive role from email pattern
    const role: Role = email.includes("operator") || email.includes("desa") ? "desa" : "admin";
    const { token, user: u } = await mockLogin(role, undefined, undefined, email);
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

