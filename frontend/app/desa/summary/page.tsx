"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { 
  VILLAGES, 
  CATEGORIES, 
  getStatus, 
  getStatusColor, 
  getStatusLabel,
  PENDING_VERIFICATIONS,
  AI_RECOMMENDATIONS
} from "@/lib/data/sdgsData";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Edit3, 
  ClipboardCheck, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Heart,
  GraduationCap,
  Wrench,
  ShieldAlert,
  Leaf,
  Landmark,
  MapPin
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Heart,
  GraduationCap,
  TrendingUp,
  Wrench,
  ShieldAlert,
  Leaf,
  Users,
  Landmark,
};

export default function DesaSummaryPage() {
  const { user } = useAuth();

  // Perangkat desa terikat secara single-tenant ke desanya sendiri
  const village = VILLAGES.find((v) => v.name === user?.village) || VILLAGES[0];
  const overallStatus = getStatus(village.overallScore);
  const statusColors = getStatusColor(overallStatus);

  // Ambil data verifikasi terkait desa ini
  const villageVerifications = PENDING_VERIFICATIONS.filter(
    (v) => v.village === village.name
  );
  const displayVerifications = villageVerifications.length > 0 
    ? villageVerifications 
    : PENDING_VERIFICATIONS.slice(0, 3);

  // Rekomendasi AI terkait desa ini
  const villageAi = AI_RECOMMENDATIONS.find((r) => r.village === village.name) || AI_RECOMMENDATIONS[0];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header & Single-Tenant Village Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Ringkasan
              </h1>
            </div>
          </div>
        </div>

        {/* Locked Village Badge */}
        <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/90 px-4 py-2.5 rounded-2xl shadow-sm self-start md:self-auto">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Peran Aktif: Perangkat Desa</p>
            <p className="text-xs font-black text-slate-900">{village.name} (Kec. {village.kecamatan})</p>
          </div>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Kolom Kiri: Profil & Aksi (3 columns wide) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>
          
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 mb-4">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Kec. {village.kecamatan}, Kab. Bogor
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
              {village.name}
            </h2>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-600 mb-8">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
                <span>{village.population.toLocaleString("id-ID")} Jiwa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>{village.dataCompletion}% Data Terisi</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
            <Link
              href="/desa/input"
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md w-full sm:w-auto justify-center"
            >
              <Edit3 className="w-4 h-4" />
              Input
            </Link>
            
            <Link
              href="/desa/rekomendasi"
              className="flex items-center gap-2 px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-all border border-emerald-200 w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Rekomendasi
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Skor Keseluruhan (1 column wide) */}
        <div 
          className="lg:col-span-1 rounded-3xl p-8 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden border"
          style={{ backgroundColor: statusColors.bg, borderColor: statusColors.border }}
        >
          <p className="text-xs font-black uppercase tracking-wider mb-4 opacity-80" style={{ color: statusColors.text }}>
            Skor Keseluruhan
          </p>
          
          <div className="mb-4">
            <span className="text-7xl font-black tracking-tighter" style={{ color: statusColors.text }}>
              {village.overallScore}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-extrabold capitalize bg-white/60 shadow-sm" style={{ color: statusColors.text }}>
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" 
              style={{ backgroundColor: statusColors.dot }}
            />
            {getStatusLabel(overallStatus)}
          </div>
        </div>
      </div>

      {/* Grid 8 Pilar Aspek Ketahanan */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">8 Pilar Ketahanan</h3>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
            Periode 2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, idx) => {
            const score = village.scores[idx] ?? 0;
            const status = getStatus(score);
            const col = getStatusColor(status);
            const IconComp = ICON_MAP[cat.icon] || LayoutDashboard;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-700 transition-colors border border-slate-100">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg border"
                    style={{ backgroundColor: col.bg, color: col.text, borderColor: col.border }}
                  >
                    {score}/100
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-slate-800 group-hover:text-emerald-900 transition-colors">
                    {cat.label}
                  </h4>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score}%`,
                        backgroundColor: col.dot,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
                    <strong style={{ color: col.text }}>{getStatusLabel(status)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Verification Status Quick View & AI Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Widget Status Verifikasi Terkini */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Status Verifikasi</h3>
                </div>
              </div>
              <Link
                href="/desa/status"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List mini verifikasi */}
            <div className="mt-4 space-y-3">
              {displayVerifications.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm text-slate-800">{item.field}</p>
                    <p className="text-xs text-slate-400">
                      <span className="font-bold text-slate-700">{item.value}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      Menunggu
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">

            <Link
              href="/desa/status"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Cek Riwayat Lengkap
            </Link>
          </div>
        </div>

        {/* Widget Rekomendasi AI Sorotan */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Rekomendasi AI</h3>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 uppercase">
                Urgensi: {villageAi.urgency}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-900 uppercase line-clamp-1">{villageAi.title}</span>
                </div>
                <p className="text-xs text-amber-950 font-medium line-clamp-1">
                  {villageAi.intervention}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">

            <Link
              href="/desa/rekomendasi"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200 flex items-center gap-1.5"
            >
              Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
