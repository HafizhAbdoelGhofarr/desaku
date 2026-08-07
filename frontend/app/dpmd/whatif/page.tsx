"use client";

import { useState, useMemo } from "react";
import { VILLAGES, CATEGORIES, getStatus, getStatusColor } from "@/lib/data/sdgsData";
import { Calculator, ArrowRight, ArrowUpRight, ArrowDownRight, RefreshCcw, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function WhatIfPage() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");
  const [selectedVillageId, setSelectedVillageId] = useState(VILLAGES[0].id);

  // Extract unique kecamatans
  const kecamatans = useMemo(() => {
    return Array.from(new Set(VILLAGES.map((v) => v.kecamatan)));
  }, []);

  // Filter villages by kecamatan
  const availableVillages = useMemo(() => {
    if (selectedKecamatan === "all") return VILLAGES;
    return VILLAGES.filter((v) => v.kecamatan === selectedKecamatan);
  }, [selectedKecamatan]);

  // Current active village
  const village = useMemo(() => {
    const found = availableVillages.find((v) => v.id === selectedVillageId);
    if (found) return found;
    return availableVillages[0] || VILLAGES[0];
  }, [availableVillages, selectedVillageId]);

  // State to hold simulated scores for each category
  const [simulatedScores, setSimulatedScores] = useState<number[]>([...village.scores]);

  // Sync simulated scores when village changes
  const handleSelectVillage = (id: string) => {
    setSelectedVillageId(id);
    const v = VILLAGES.find((x) => x.id === id);
    if (v) {
      setSimulatedScores([...v.scores]);
    }
  };

  const handleKecamatanChange = (kec: string) => {
    setSelectedKecamatan(kec);
    const filtered = kec === "all" ? VILLAGES : VILLAGES.filter((v) => v.kecamatan === kec);
    if (filtered.length > 0) {
      setSelectedVillageId(filtered[0].id);
      setSimulatedScores([...filtered[0].scores]);
    }
  };

  const handleReset = () => {
    setSimulatedScores([...village.scores]);
  };

  const handleScoreChange = (index: number, val: number) => {
    const newScores = [...simulatedScores];
    newScores[index] = val;
    setSimulatedScores(newScores);
  };

  const currentOverall = village.overallScore;
  const simOverall = Math.round(simulatedScores.reduce((a, b) => a + b, 0) / simulatedScores.length);
  const diff = simOverall - currentOverall;

  const chartData = CATEGORIES.map((cat, i) => ({
    name: cat.label,
    "Saat Ini": village.scores[i],
    "Simulasi": simulatedScores[i],
  }));

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            What-If Analysis Kebijakan
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base max-w-3xl">
            Simulasikan dampak intervensi anggaran & kebijakan per indikator untuk memprediksi kenaikan indeks ketahanan desa.
          </p>
        </div>

        {/* Filter Kecamatan Bar */}
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-500 uppercase">Kecamatan:</span>
          <select
            value={selectedKecamatan}
            onChange={(e) => handleKecamatanChange(e.target.value)}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/90 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Pilih Desa Sasaran Intervensi
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm"
                value={village.id}
                onChange={(e) => handleSelectVillage(e.target.value)}
              >
                {availableVillages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} (Kec. {v.kecamatan})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Simulasi 8 Pilar Intervensi</h3>
            <button 
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Reset ke nilai awal"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{cat.label}</span>
                  <span className="text-blue-600 font-black">{simulatedScores[i]} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulatedScores[i]}
                  onChange={(e) => handleScoreChange(i, parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-2 space-y-8">
          {/* Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/90 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Skor Baseline (Saat Ini)</div>
              <div className="text-4xl font-black text-slate-900">{currentOverall}</div>
              <div className="text-xs font-bold mt-2 text-slate-600">
                Status: <span style={{ color: getStatusColor(getStatus(currentOverall)).text }}>{getStatus(currentOverall).toUpperCase()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="p-3 bg-slate-100 rounded-full text-slate-400 hidden md:block">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            <div className={`p-6 rounded-3xl border text-center ${diff > 0 ? "bg-emerald-50 border-emerald-200" : diff < 0 ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200"}`}>
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Proyeksi Hasil Intervensi</div>
              <div className="flex items-center justify-center gap-2">
                <div className={`text-4xl font-black ${diff > 0 ? "text-emerald-700" : diff < 0 ? "text-rose-700" : "text-slate-900"}`}>
                  {simOverall}
                </div>
                {diff !== 0 && (
                  <div className={`flex items-center text-sm font-black px-2 py-0.5 rounded-lg ${diff > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {diff > 0 ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
                    {diff > 0 ? `+${diff}` : diff}
                  </div>
                )}
              </div>
              <div className="text-xs font-bold mt-2 text-slate-600">
                Status: <span style={{ color: getStatusColor(getStatus(simOverall)).text }}>{getStatus(simOverall).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Komparasi 8 Pilar: Baseline vs Hasil Intervensi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sasaran: {village.name} (Kec. {village.kecamatan})
                </p>
              </div>
            </div>

            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} 
                    angle={-30} 
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[0, 100]} />
                  <Tooltip cursor={{fill: "#f8fafc"}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="Saat Ini" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={18} />
                  <Bar dataKey="Simulasi" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
