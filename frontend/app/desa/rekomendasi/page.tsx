"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { 
  VILLAGES, 
  CATEGORIES, 
  AI_RECOMMENDATIONS, 
  getStatus, 
  getStatusLabel 
} from "@/lib/data/sdgsData";
import { 
  Sparkles, 
  Building2, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  AlertTriangle, 
  Activity, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Layers,
  Compass
} from "lucide-react";

export default function DesaRekomendasiPage() {
  const { user } = useAuth();

  const defaultVillage = VILLAGES.find((v) => v.name === user?.village) || VILLAGES[0];
  const [selectedVillageId, setSelectedVillageId] = useState(defaultVillage.id);
  const village = VILLAGES.find((v) => v.id === selectedVillageId) || defaultVillage;

  // Temukan rekomendasi AI untuk desa yang dipilih (atau fallback yang relevan)
  const currentRec = AI_RECOMMENDATIONS.find((r) => r.village === village.name) || {
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
  };

  const status = getStatus(village.overallScore);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Rekomendasi Kebijakan AI
            </h1>
            <p className="text-slate-500 mt-0.5">
              Rencana aksi prioritas dan pemodelan rantai dampak kausal untuk {village.name}.
            </p>
          </div>
        </div>

        {/* Switcher Desa Demo */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-400 uppercase">Pilih Desa:</span>
          <select
            value={selectedVillageId}
            onChange={(e) => setSelectedVillageId(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            {VILLAGES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.kecamatan})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Focus Card */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-lg shadow-indigo-50/50 overflow-hidden">
        <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-200 border border-white/10">
                Kecamatan {village.kecamatan}
              </span>
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-400/30 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Urgensi: {currentRec.urgency}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white/10 px-4 py-1.5 rounded-2xl backdrop-blur-sm border border-white/15">
              <span className="text-xs text-indigo-200 font-medium">Skor Ketahanan:</span>
              <span className="text-xl font-black text-white">{village.overallScore}</span>
              <span className="text-xs text-indigo-300">/ 100 ({getStatusLabel(status)})</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug">
            {currentRec.title}
          </h2>
          <p className="text-indigo-100/90 mt-2 text-sm md:text-base max-w-4xl leading-relaxed">
            {currentRec.summary}
          </p>
        </div>

        {/* Warning if data completion is low */}
        {currentRec.dataWarning && (
          <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{currentRec.dataWarning}</span>
            </div>
            <Link
              href="/desa/input"
              className="font-bold underline hover:text-amber-950 shrink-0 ml-2"
            >
              Lengkapi Data Sekarang &rarr;
            </Link>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-8">
          
          {/* 1. Indikator Akar Masalah (Root Cause) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                Indikator Kunci yang Membutuhkan Intervensi Cepat
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentRec.rootIndicators.map((ind, idx) => {
                const cat = CATEGORIES.find((c) => c.id === ind.catId);
                const isDown = ind.trend === "down";
                const isUp = ind.trend === "up";

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-500">{cat?.label || "Pilar Utama"}</span>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isDown ? "text-rose-600" : isUp ? "text-emerald-600" : "text-slate-500"
                        }`}
                      >
                        {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                        {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                        {!isDown && !isUp && <Minus className="w-3.5 h-3.5" />}
                        {isDown ? "Menurun" : isUp ? "Membaik" : "Stabil"}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 text-sm">{ind.name}</p>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-2xl font-black text-slate-800">{ind.score}</span>
                      <span className="text-xs text-slate-400 font-medium">skor sektor</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Causal Chain Diagram & Explanation */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                Analisis Kausal AI (Causal Chain)
              </h3>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 relative overflow-hidden border border-slate-800">
              <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <p className="text-sm md:text-base leading-relaxed text-slate-200 relative z-10">
                &ldquo;{currentRec.causalChain}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs text-indigo-300">
                <span className="font-semibold uppercase tracking-wider text-slate-400">Pilar yang Saling Berdampak:</span>
                {currentRec.correlatedCats?.map((cid) => {
                  const c = CATEGORIES.find((cat) => cat.id === cid);
                  return (
                    <span key={cid} className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-200 font-medium">
                      {c?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Action Plan & Intervention */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                Rencana Aksi & Intervensi Strategis
              </h3>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl font-black text-lg shrink-0">
                  AI
                </div>
                <div>
                  <h4 className="font-bold text-amber-950 text-base">Paket Program Rekomendasi</h4>
                  <p className="text-sm text-amber-900 mt-1 leading-relaxed">
                    {currentRec.intervention}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Action Steps for Perangkat Desa */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                Panduan Langkah Eksekusi untuk Perangkat Desa
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-bold text-slate-900">Validasi Lapangan</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lakukan verifikasi kondisi riil di tingkat RW/RT untuk indikator yang disorot AI sebelum menyusun anggaran.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-bold text-slate-900">Bawa ke Musrenbangdes</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gunakan rekomendasi kausal ini sebagai dasar penetapan prioritas belanja RKPDes dan APBDes tahun berjalan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-bold text-slate-900">Update Indikator Berkala</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Input data hasil intervensi setiap periode melalui form input agar peningkatan skor tercatat resmi.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Call to action */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Rekomendasi dihitung otomatis berdasarkan data terverifikasi DPMD.</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/desa/input"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center gap-2"
              >
                <span>Update Indikator Desa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
