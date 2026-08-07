import Link from "next/link";
import { Leaf, ArrowLeft, LogIn } from "lucide-react";

export default function PublikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors text-sm font-semibold"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Beranda</span>
            </Link>

            <div className="h-6 w-px bg-slate-200" />

            <Link href="/publik/skor" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                  Desa Ku
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                  Transparansi Ketahanan Desa
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Petugas</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Sistem Desa Ku — Transparansi Pembangunan & Ketahanan Desa.</p>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Beranda
            </Link>
            <span>•</span>
            <Link href="/publik/skor" className="hover:text-emerald-700 transition-colors">
              Skor Desa & Suara Warga
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-emerald-700 transition-colors">
              Portal Petugas
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
