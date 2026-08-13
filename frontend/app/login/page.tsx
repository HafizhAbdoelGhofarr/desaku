"use client";

import { useState } from "react";
import { 
  Leaf, 
  ArrowRight, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("admin@kabupaten.go.id");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-10 px-4">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-emerald-800 to-teal-800 -skew-y-3 origin-top-left -z-10 shadow-2xl"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20 -z-10"></div>

      <div className="w-full max-w-4xl grid md:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Left Side */}
        <div className="md:col-span-5 bg-slate-900 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 to-slate-950 z-0"></div>
          
          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-md w-fit border border-white/15">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-sm tracking-tight">Sistem Desa Ku</span>
            </Link>
            
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Globe2 className="w-3.5 h-3.5" />
                Nasional
              </div>
              <h2 className="text-2xl font-black leading-tight text-white">
                Monitoring & Simulasi SDGs Desa
              </h2>
              <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                Platform terpadu untuk Pemerintah Kabupaten dan Perangkat Desa di seluruh Indonesia.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} Desaku</span>
            <span className="text-emerald-400 font-semibold">Desa Mandiri AI</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
          
          <div className="md:hidden flex items-center gap-2.5 mb-6">
             <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
             </div>
             <span className="font-black text-lg text-slate-900">Sistem Desa Ku</span>
          </div>

          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-black text-slate-900">Masuk</h3>
            <p className="text-xs text-slate-400 mt-1">Gunakan akun yang terdaftar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.go.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <button type="button" className="text-[11px] text-emerald-700 font-semibold hover:underline">
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="text-xs text-slate-500 select-none cursor-pointer">
                Ingat saya
              </label>
            </div>

            <div className="pt-1 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Memproses...
                  </span>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link href="/publik" className="text-xs font-semibold text-slate-400 hover:text-emerald-700 transition-colors">
                  Lihat sebagai <b>Masyarakat Umum</b> &rarr;
                </Link>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

