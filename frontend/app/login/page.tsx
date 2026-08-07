"use client";

import { useState } from "react";
import { Leaf, ArrowRight, Building, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import type { Role } from "@/lib/auth";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>("dpmd");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-emerald-700 -skew-y-3 origin-top-left -z-10 shadow-2xl"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20 -z-10"></div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden mx-4">
        
        {/* Left Side: Brand & Info */}
        <div className="bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent z-0"></div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md w-fit">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="font-bold tracking-tight">Sistem Desa Ku</span>
            </Link>
            <h2 className="text-4xl font-bold mt-12 mb-6 leading-tight">
              Akses Portal <br/>
              <span className="text-emerald-400">Monitoring Desa</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Gunakan kredensial yang telah diberikan oleh administrator sistem untuk masuk ke dashboard sesuai dengan role Anda.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-4 text-sm text-slate-500">
            <span>&copy; {new Date().getFullYear()} Gemastik XIX</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>Versi MVP</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 sm:p-14 lg:p-16 flex flex-col justify-center bg-white">
          <div className="md:hidden flex items-center gap-3 mb-10">
             <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
             </div>
             <span className="font-bold text-xl text-slate-900">Sistem Desa Ku</span>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-2">Selamat Datang</h3>
          <p className="text-slate-500 mb-10">Pilih role untuk mensimulasikan login</p>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole("dpmd")}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedRole === "dpmd" 
                    ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-600/10" 
                    : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <ShieldCheck className={`w-8 h-8 mb-4 ${selectedRole === "dpmd" ? "text-emerald-600" : "text-slate-400"}`} />
                <div className={`font-semibold ${selectedRole === "dpmd" ? "text-emerald-900" : "text-slate-700"}`}>Admin DPMD</div>
                <div className="text-xs text-slate-500 mt-1">Verifikasi & Analisa</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("desa")}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedRole === "desa" 
                    ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-600/10" 
                    : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Building className={`w-8 h-8 mb-4 ${selectedRole === "desa" ? "text-emerald-600" : "text-slate-400"}`} />
                <div className={`font-semibold ${selectedRole === "desa" ? "text-emerald-900" : "text-slate-700"}`}>Perangkat Desa</div>
                <div className="text-xs text-slate-500 mt-1">Input Data Indikator</div>
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-slate-900 text-white rounded-2xl py-4 font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Memproses...
                  </span>
                ) : (
                  <>
                    Masuk Sekarang 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="text-center">
                <Link href="/publik" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
                  Atau masuk sebagai Masyarakat Umum (Portal Publik)
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
