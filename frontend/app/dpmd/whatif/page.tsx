"use client";

import { useState } from "react";
import { VILLAGES, CATEGORIES, getStatus, getStatusColor } from "@/lib/data/sdgsData";
import { Calculator, ArrowRight, ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

export default function WhatIfPage() {
  const [selectedVillageId, setSelectedVillageId] = useState(VILLAGES[0].id);
  const village = VILLAGES.find((v) => v.id === selectedVillageId)!;

  // State to hold simulated scores for each category
  const [simulatedScores, setSimulatedScores] = useState<number[]>([...village.scores]);

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
    <div className="space-y-8 pb-10 max-w-6xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          What-If Analysis
        </h1>
        <p className="text-slate-500 mt-2 text-lg max-w-3xl">
          Simulasikan dampak intervensi pada indikator desa untuk memprediksi perubahan skor ketahanan secara instan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Desa untuk Simulasi</label>
            <select
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              value={selectedVillageId}
              onChange={(e) => {
                setSelectedVillageId(e.target.value);
                const v = VILLAGES.find(x => x.id === e.target.value)!;
                setSimulatedScores([...v.scores]);
              }}
            >
              {VILLAGES.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Intervensi Kategori</h3>
            <button 
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Reset Simulasi"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{cat.label}</span>
                  <span className="font-bold text-blue-600">{simulatedScores[i]}</span>
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
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="text-sm font-medium text-slate-500 mb-2">Skor Saat Ini</div>
              <div className="text-4xl font-black text-slate-900">{currentOverall}</div>
              <div className="text-sm font-semibold mt-2 text-slate-600">
                Status: <span style={{ color: getStatusColor(getStatus(currentOverall)).text }}>{getStatus(currentOverall).toUpperCase()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-slate-300 hidden md:block" />
            </div>

            <div className={`p-6 rounded-3xl border ${diff > 0 ? "bg-emerald-50 border-emerald-100" : diff < 0 ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}`}>
              <div className="text-sm font-medium text-slate-500 mb-2">Proyeksi Skor</div>
              <div className="flex items-end gap-3">
                <div className={`text-4xl font-black ${diff > 0 ? "text-emerald-700" : diff < 0 ? "text-rose-700" : "text-slate-900"}`}>
                  {simOverall}
                </div>
                {diff !== 0 && (
                  <div className={`flex items-center text-lg font-bold pb-1 ${diff > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {diff > 0 ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
                    {Math.abs(diff)}
                  </div>
                )}
              </div>
              <div className="text-sm font-semibold mt-2 text-slate-600">
                Status: <span style={{ color: getStatusColor(getStatus(simOverall)).text }}>{getStatus(simOverall).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6">Perbandingan Kategori: Saat Ini vs Simulasi</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#64748b" }} 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} domain={[0, 100]} />
                  <Tooltip cursor={{fill: "#f8fafc"}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="Saat Ini" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="Simulasi" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
