"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { AI_RECOMMENDATIONS, VILLAGES, getStatusColor, getStatus } from "@/lib/data/sdgsData";
import { Sparkles, MapPin, AlertTriangle, Activity, Zap, ArrowRight } from "lucide-react";

export default function DesaRekomendasiPage() {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const village = useMemo(() => {
    return VILLAGES.find((v) => v.name === user?.village) || VILLAGES[0];
  }, [user]);

  // Filter recommendations specifically for this village
  const villageRecommendations = useMemo(() => {
    const recs = AI_RECOMMENDATIONS.filter((r) => r.village === village.name);
    
    // Fallback if no mock data exists for this specific village
    if (recs.length === 0) {
      return [{
        id: `rec-${village.id}`,
        village: village.name,
        kecamatan: village.kecamatan,
        urgency: village.overallScore < 50 ? "tinggi" : village.overallScore < 70 ? "sedang" : "rendah",
        overallScore: village.overallScore,
        title: `Optimasi Ketahanan & Kemandirian ${village.name}`,
        summary: `Skor ketahanan desa saat ini mencapai ${village.overallScore}/100. Diperlukan akselerasi pada pilar yang memiliki selisih capaian terbesar terhadap target 80+.`,
        rootIndicators: [
          { catId: 3, name: "Akses Permodalan UMKM", score: village.scores[2] || 50, trend: "stable" as const },
          { catId: 4, name: "Kualitas Infrastruktur Jalan", score: village.scores[3] || 55, trend: "up" as const },
          { catId: 1, name: "Cakupan Layanan Kesehatan", score: village.scores[0] || 60, trend: "stable" as const },
        ],
        causalChain: `Keterbatasan modal UMKM (Ekonomi) membatasi penyerapan tenaga kerja muda di desa. Akses jalan desa yang belum merata (Infrastruktur) menambah biaya logistik hasil tani, berdampak pada pendapatan rumah tangga dan kemampuan investasi gizi keluarga (Kesehatan).`,
        correlatedCats: [3, 4, 1],
        intervention: `Penguatan permodalan BUMDes unit simpan pinjam + perbaikan jalan sentra produksi + pembinaan gizi Posyandu. Estimasi dampak: +7 poin skor dalam 12 bulan.`,
        dataQuality: village.dataCompletion,
        dataWarning: village.dataCompletion < 70 ? "Kelengkapan data di bawah 70%. Perbarui indikator desa untuk analisis yang lebih presisi." : null,
      }];
    }
    return recs;
  }, [village]);

  if (expandedId) {
    const rec = villageRecommendations.find(r => r.id === expandedId);
    if (rec) {
      const colors = getStatusColor(getStatus(rec.overallScore));
      return (
        <div className="space-y-6 pb-10 max-w-4xl mx-auto">
          <button 
            onClick={() => setExpandedId(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-bold mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Kembali ke Daftar Rekomendasi
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Header Detail */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-900">{rec.village}</span>
                    <span className="text-slate-400 text-xs font-semibold">• Kec. {rec.kecamatan}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-4">
                    {rec.title}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-rose-50 border-rose-100 text-rose-700 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    Urgensi: {rec.urgency.toUpperCase()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 shrink-0">
                  <span className="text-xs font-bold text-slate-400 uppercase">Skor Saat Ini</span>
                  <span className="text-3xl font-black" style={{ color: colors.text }}>
                    {rec.overallScore}<span className="text-sm text-slate-400 font-medium">/100</span>
                  </span>
                </div>
              </div>

              {/* Content Detail */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    Akar Permasalahan Terdeteksi (Causal Chain)
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    {rec.causalChain}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Rekomendasi Aksi Intervensi
                  </h3>
                  <div className="bg-amber-50/60 border border-amber-100 p-5 rounded-2xl">
                    <p className="text-amber-900 font-semibold text-sm leading-relaxed">{rec.intervention}</p>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Link 
                    href="/desa/whatif"
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-200"
                  >
                    <span>Simulasikan Dampak di What-If</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-100">
            <span>Rekomendasi AI</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            Rekomendasi Kebijakan
          </h1>
        </div>
      </div>

      {/* Recommendations Cards List View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {villageRecommendations.map((rec) => {
          const colors = getStatusColor(getStatus(rec.overallScore));
          
          return (
            <div 
              key={rec.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden group hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between p-6"
              onClick={() => setExpandedId(rec.id)}
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-900">{rec.village}</span>
                  <span className="text-slate-400 text-xs font-semibold">• Kec. {rec.kecamatan}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug mb-4 group-hover:text-indigo-700 transition-colors line-clamp-2">
                  {rec.title}
                </h2>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-rose-50 border-rose-100 text-rose-700 text-[11px] font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {rec.urgency.toUpperCase()}
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Skor Saat Ini</span>
                  <span className="text-lg font-black" style={{ color: colors.text }}>
                    {rec.overallScore}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
