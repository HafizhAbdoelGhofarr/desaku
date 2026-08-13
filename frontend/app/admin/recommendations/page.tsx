"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AI_RECOMMENDATIONS, getStatusColor, getStatus } from "@/lib/data/sdgsData";
import { Sparkles, MapPin, AlertTriangle, Activity, Zap, Filter, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

export default function RecommendationsPage() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const kecamatans = useMemo(() => {
    return Array.from(new Set(AI_RECOMMENDATIONS.map((r) => r.kecamatan)));
  }, []);

  const filteredRecommendations = useMemo(() => {
    return AI_RECOMMENDATIONS.filter((rec) => {
      const matchKec = selectedKecamatan === "all" || rec.kecamatan === selectedKecamatan;
      const matchUrg = selectedUrgency === "all" || rec.urgency.toLowerCase() === selectedUrgency.toLowerCase();
      return matchKec && matchUrg;
    });
  }, [selectedKecamatan, selectedUrgency]);

  if (expandedId) {
    const rec = AI_RECOMMENDATIONS.find(r => r.id === expandedId);
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
                    href="/admin/whatif"
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-500 uppercase">Kecamatan:</span>
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Kecamatan</option>
              {kecamatans.map((kec) => (
                <option key={kec} value={kec}>
                  Kec. {kec}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Urgensi:</span>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Urgensi</option>
              <option value="tinggi">Tinggi (Kritis)</option>
              <option value="sedang">Sedang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations Cards List View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRecommendations.map((rec) => {
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Skor</span>
                  <span className="text-lg font-black" style={{ color: colors.text }}>
                    {rec.overallScore}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredRecommendations.length === 0 && (
          <div className="lg:col-span-2 p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Sparkles className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800">Tidak ada rekomendasi yang sesuai filter</h3>
            <p className="text-xs text-slate-400 mt-1">Coba ubah filter Kecamatan atau tingkat Urgensi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
