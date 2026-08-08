"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { LayoutDashboard, LogOut, Leaf, Edit3, ClipboardCheck, Sparkles, TrendingUp, MessageCircle } from "lucide-react";

export default function DesaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Ringkasan", href: "/desa/summary", icon: LayoutDashboard },
    { name: "Input Indikator", href: "/desa/input", icon: Edit3 },
    { name: "Status Verifikasi", href: "/desa/status", icon: ClipboardCheck },
    { name: "Simulasi Kebijakan", href: "/desa/whatif", icon: TrendingUp },
    { name: "Rekomendasi AI", href: "/desa/rekomendasi", icon: Sparkles },
    { name: "Suara Warga", href: "/desa/laporan", icon: MessageCircle },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-emerald-900 text-emerald-100 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-emerald-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Sistem Desa Ku</span>
          </Link>
        </div>

        <div className="px-6 py-6">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">Portal Perangkat Desa</p>
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
                      ? "bg-white text-emerald-900 shadow-md"
                      : "hover:bg-emerald-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-emerald-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">
              {mounted && user?.name ? user.name.charAt(0).toUpperCase() : "D"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {mounted && user?.name ? user.name : "Perangkat Desa"}
              </p>
              <p className="text-xs text-emerald-300 truncate">
                {mounted && user?.village ? user.village : "Pemerintah Desa"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4">
          <div className="font-bold text-emerald-900">Portal Desa</div>
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
