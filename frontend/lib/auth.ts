export type Role = "admin" | "dpmd" | "desa" | "publik";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  village?: string;
  villageId?: string;
}

const TOKEN_KEY = "sdk_auth_token";
const USER_KEY  = "sdk_user";

export function setSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSession(): { token: string; user: AuthUser } | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const raw   = localStorage.getItem(USER_KEY);
  if (!token || !raw) return null;
  try { return { token, user: JSON.parse(raw) as AuthUser }; } catch { return null; }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getRoleDashboard(role: Role): string {
  return { 
    admin: "/admin/dashboard", 
    dpmd: "/admin/dashboard", 
    desa: "/desa/summary", 
    publik: "/publik/skor" 
  }[role];
}

const MOCK_USERS: Record<Role, AuthUser> = {
  admin:  { id: "u1", name: "Budi Santoso",    email: "budi@admin.go.id",  role: "admin" },
  dpmd:   { id: "u1", name: "Budi Santoso",    email: "budi@admin.go.id",  role: "admin" },
  desa:   { id: "u2", name: "Sari Wulandari",  email: "sari@desa.go.id",   role: "desa", village: "Desa Sukamaju", villageId: "v1" },
  publik: { id: "u3", name: "Warga",            email: "",                  role: "publik" },
};

export async function mockLogin(role: Role): Promise<{ token: string; user: AuthUser }> {
  await new Promise((r) => setTimeout(r, 400));
  return { token: `mock-jwt-${role}-${Date.now()}`, user: MOCK_USERS[role] };
}
