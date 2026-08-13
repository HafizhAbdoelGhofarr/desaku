"use client";

import { useState, useMemo } from "react";
import { 
  VILLAGES, 
  CATEGORIES, 
  getStatus, 
  getStatusColor, 
  getStatusLabel 
} from "@/lib/data/sdgsData";
import { 
  simulatePolicyImpact 
} from "@/lib/data/causalEngine";
import { 
  Sparkles, 
  ArrowUpRight, 
  Building2,
  TrendingUp, 
  RotateCcw,
  CheckCircle2,
  Filter
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

export default function WhatIfPage() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");
  const [selectedVillageId, setSelectedVillageId] = useState<string>("");

  const kecamatans = useMemo(() => {
    return Array.from(new Set(VILLAGES.map((v) => v.kecamatan)));
  }, []);

  const availableVillages = useMemo(() => {
    if (selectedKecamatan === "all") return VILLAGES;
    return VILLAGES.filter((v) => v.kecamatan === selectedKecamatan);
  }, [selectedKecamatan]);

  const village = useMemo(() => {
    return availableVillages.find((v) => v.id === selectedVillageId) || null;
  }, [availableVillages, selectedVillageId]);

  // Form State - Direct User Input
  const [programTitle, setProgramTitle] = useState("Bantuan Keuangan Khusus Pembangunan Jalan Usaha Tani & Irigasi");
  const [budget, setBudget] = useState<number>(150_000_000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);

  // AI Causal Result
  const aiResult = useMemo(() => {
    if (!village) return null;
    return simulatePolicyImpact(
      programTitle || "Program Bantuan Kabupaten",
      budget || 0,
      "Dusun Sasaran",
      village.scores
    );
  }, [programTitle, budget, village]);

  const handleSelectVillage = (id: string) => {
    setSelectedVillageId(id);
    setSavedSuccess(false);
    setHasSimulated(false);
  };

  const handleKecamatanChange = (kec: string) => {
    setSelectedKecamatan(kec);
    setSelectedVillageId("");
    setSavedSuccess(false);
    setHasSimulated(false);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasSimulated(true);
    }, 300);
  };

  const handleReset = () => {
    setProgramTitle("Bantuan Keuangan Khusus Pembangunan Jalan Usaha Tani & Irigasi");
    setBudget(150_000_000);
    setSavedSuccess(false);
    setHasSimulated(false);
  };

  const currentStatus = village ? getStatus(village.overallScore) : "critical";
  const simStatus = aiResult ? getStatus(aiResult.newOverallScore) : "critical";
  const currentColor = getStatusColor(currentStatus);
  const simColor = getStatusColor(simStatus);

  const chartData = useMemo(() => {
    if (!village || !aiResult) return [];
    return CATEGORIES.map((cat, i) => ({
      name: cat.label.split(" ")[0],
      fullName: cat.label,
      "Baseline Saat Ini": village.scores[i],
      "Hasil Proyeksi": aiResult.simulatedScores[i],
    }));
  }, [village, aiResult]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* 1. Header & Target Village Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            Simulasi Kebijakan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulasikan dampak intervensi program.
          </p>
        </div>

        {/* Village & Kecamatan Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedKecamatan}
              onChange={(e) => handleKecamatanChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Kec.</option>
              {kecamatans.map((kec) => (
                <option key={kec} value={kec}>
                  Kec. {kec}
                </option>
              ))}
            </select>
          </div>

          {village && (
            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span className="text-xs font-bold text-blue-900">{village.name}</span>
              <button
                onClick={() => handleSelectVillage("")}
                className="ml-1 text-blue-400 hover:text-blue-700 transition-colors"
                title="Ganti Desa"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {!village ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Pilih Desa Sasaran</h3>
            <p className="text-slate-500 text-sm">
              Pilih desa yang akan disimulasikan program bantuannya.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {availableVillages.map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelectVillage(v.id)}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left flex flex-col gap-1.5 group"
              >
                <span className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{v.name}</span>
                <span className="text-[11px] text-slate-500">Kec. {v.kecamatan}</span>
                <span className="text-[10px] font-bold mt-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md self-start">
                  Skor: {v.overallScore}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
      {/* 2. Input Langsung Program & Anggaran Intervensi */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Program:
            </label>
            <input
              type="text"
              value={programTitle}
              onChange={(e) => {
                setProgramTitle(e.target.value);
                setHasSimulated(false);
              }}
              placeholder="Contoh: Pembangunan Jalan Tani..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Anggaran (Rp):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="5000000"
                value={budget}
                onChange={(e) => {
                  setBudget(Number(e.target.value));
                  setHasSimulated(false);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSimulate}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                <span>Simulasi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {!hasSimulated ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Belum Ada Hasil Simulasi</h3>
          <p className="text-slate-500 max-w-md text-sm">
            Silakan masukkan nama program dan anggaran di atas, lalu klik tombol <span className="font-bold text-slate-700">Simulasi</span> untuk melihat proyeksi dampaknya.
          </p>
        </div>
      ) : (
        <>
      {/* 3. Ringkasan Skor & Dampak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Skor Saat Ini</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{village.overallScore}</div>
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
              style={{ backgroundColor: currentColor.bg, color: currentColor.text, borderColor: currentColor.border }}
            >
              {getStatusLabel(currentStatus)}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Skor Proyeksi</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{aiResult.newOverallScore}</div>
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
              style={{ backgroundColor: simColor.bg, color: simColor.text, borderColor: simColor.border }}
            >
              {getStatusLabel(simStatus)}
            </span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-800 uppercase">Kenaikan Total</span>
            <div className="flex items-center gap-1.5 mt-1 text-3xl font-black text-blue-700">
              <ArrowUpRight className="w-7 h-7 font-bold" />
              <span>+{aiResult.deltaOverallScore} Poin</span>
            </div>
            <span className="text-[11px] text-blue-800 font-semibold">
              Efisiensi: {aiResult.roiMetric}
            </span>
          </div>
          <button
            onClick={handleReset}
            title="Reset formulir"
            className="p-2.5 bg-white hover:bg-blue-100 rounded-xl border border-blue-200 text-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Rantai Kausalitas & Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Rantai Dampak Kausal (Left) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Dampak Intervensi
            </h3>
          </div>

          {/* Pilar Utama */}
          <div className="p-4 rounded-xl bg-blue-900 text-white space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-500/30 text-blue-200 rounded">
                Dampak Langsung
              </span>
              <span className="font-black text-sm text-blue-300">
                +{aiResult.primaryPillar.delta} Poin
              </span>
            </div>
            <h4 className="font-bold text-sm text-white pt-1">{aiResult.primaryPillar.name}</h4>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              {aiResult.primaryPillar.rationale}
            </p>
          </div>

          {/* Efek Domino */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Efek Lanjutan:
            </span>
            <div className="space-y-2">
              {aiResult.rippleEffects.map((r) => (
                <div key={r.pillarId} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800">{r.pillarName}:</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{r.rationale}</p>
                  </div>
                  <span className="font-extrabold text-blue-700 shrink-0 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    +{r.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Narasi AI Singkat */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1">💡 Analisis AI:</span>
            {aiResult.causalSummary}
          </div>
        </div>

        {/* Grafik Komparasi (Right) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Perbandingan 8 Pilar
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Desa {village.name}</p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  formatter={(val, name) => [`${val} Poin`, name]}
                  contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} 
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
                <Bar dataKey="Baseline Saat Ini" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Hasil Proyeksi" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs">
            <button
              onClick={() => {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2500);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{savedSuccess ? "Tersimpan!" : "Simpan"}</span>
            </button>
          </div>
        </div>

      </div>
        </>
      )}
        </>
      )}

    </div>
  );
}
