"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { 
  LayoutDashboard, 
  CheckSquare, 
  LineChart, 
  TrendingUp, 
  LogOut, 
  Leaf, 
  Sparkles, 
  MessageCircle,
  Building2
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Verifikasi Data", href: "/admin/verification", icon: CheckSquare },
    { name: "Perbandingan Desa", href: "/admin/comparison", icon: LineChart },
    { name: "What-If Analysis", href: "/admin/whatif", icon: TrendingUp },
    { name: "Rekomendasi AI", href: "/admin/recommendations", icon: Sparkles },
    { name: "Suara Warga", href: "/admin/reports", icon: MessageCircle },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Sistem Desa Ku</span>
          </Link>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Administrator Kabupaten
            </p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              {mounted && user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {mounted && user?.name ? user.name : "Administrator DPMD"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {mounted && user?.email ? user.email : "admin@dpmd.go.id"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (simplified) */}
        <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4">
          <div className="font-bold">Sistem Desa Ku</div>
          <button onClick={logout} className="text-sm text-rose-500">Logout</button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
