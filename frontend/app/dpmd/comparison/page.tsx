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
  LineChart, 
  X, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Scale 
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";

const VILLAGE_COLORS = [
  { stroke: "#059669", fill: "#10b981", name: "Emerald" }, // Desa 1
  { stroke: "#2563eb", fill: "#3b82f6", name: "Blue" },    // Desa 2
  { stroke: "#d97706", fill: "#f59e0b", name: "Amber" },   // Desa 3
  { stroke: "#e11d48", fill: "#f43f5e", name: "Rose" },    // Desa 4
];

export default function ComparisonPage() {
  // Selected villages for comparison (default 2 villages)
  const [selectedVillageIds, setSelectedVillageIds] = useState<string[]>([
    VILLAGES[0].id, // Sukamaju (78)
    VILLAGES[1].id, // Bojong Murni (45)
  ]);

  // Selected villages objects
  const selectedVillages = useMemo(() => {
    return selectedVillageIds
      .map((id) => VILLAGES.find((v) => v.id === id))
      .filter((v): v is typeof VILLAGES[0] => v !== undefined);
  }, [selectedVillageIds]);

  // Radar Chart data formatted for Recharts
  const radarData = useMemo(() => {
    return CATEGORIES.map((cat, catIdx) => {
      const dataPoint: Record<string, string | number> = {
        category: cat.label.split(" ")[0], // Short name
        fullName: cat.label,
      };

      selectedVillages.forEach((village) => {
        dataPoint[village.name] = village.scores[catIdx] || 0;
      });

      return dataPoint;
    });
  }, [selectedVillages]);

  // Disparity analysis (gap calculation)
  const disparityAnalysis = useMemo(() => {
    if (selectedVillages.length < 2) return null;

    let maxGap = -1;
    let maxGapCat = CATEGORIES[0];
    let maxGapDetails = { highest: { name: "", score: 0 }, lowest: { name: "", score: 100 } };

    CATEGORIES.forEach((cat, catIdx) => {
      const scores = selectedVillages.map((v) => ({ name: v.name, score: v.scores[catIdx] || 0 }));
      const sorted = [...scores].sort((a, b) => b.score - a.score);
      const gap = sorted[0].score - sorted[sorted.length - 1].score;

      if (gap > maxGap) {
        maxGap = gap;
        maxGapCat = cat;
        maxGapDetails = {
          highest: sorted[0],
          lowest: sorted[sorted.length - 1],
        };
      }
    });

    return {
      category: maxGapCat.label,
      gap: maxGap,
      highestVillage: maxGapDetails.highest.name,
      highestScore: maxGapDetails.highest.score,
      lowestVillage: maxGapDetails.lowest.name,
      lowestScore: maxGapDetails.lowest.score,
    };
  }, [selectedVillages]);

  // Add village to comparison
  const handleAddVillage = (id: string) => {
    if (!selectedVillageIds.includes(id) && selectedVillageIds.length < 4) {
      setSelectedVillageIds([...selectedVillageIds, id]);
    }
  };

  // Remove village from comparison
  const handleRemoveVillage = (id: string) => {
    if (selectedVillageIds.length > 2) {
      setSelectedVillageIds(selectedVillageIds.filter((vId) => vId !== id));
    }
  };

  // Quick Preset Handlers
  const handlePresetHighLow = () => {
    const sorted = [...VILLAGES].sort((a, b) => b.overallScore - a.overallScore);
    if (sorted.length >= 2) {
      setSelectedVillageIds([sorted[0].id, sorted[sorted.length - 1].id]);
    }
  };

  const handlePresetCiawi = () => {
    const ciawiVillages = VILLAGES.filter((v) => v.kecamatan === "Ciawi");
    if (ciawiVillages.length >= 2) {
      setSelectedVillageIds(ciawiVillages.slice(0, 3).map((v) => v.id));
    } else {
      setSelectedVillageIds([VILLAGES[0].id, VILLAGES[1].id]);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Perbandingan Multidimensi Desa
              </h1>
              <p className="text-slate-500 mt-0.5">
                Analisis komparasi *head-to-head* capaian 8 pilar ketahanan untuk mengidentifikasi disparitas wilayah.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase">Preset:</span>
          <button
            onClick={handlePresetHighLow}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 text-xs font-bold text-slate-700 rounded-xl transition-all shadow-sm"
          >
            Tertinggi vs Terendah
          </button>
          <button
            onClick={handlePresetCiawi}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 text-xs font-bold text-slate-700 rounded-xl transition-all shadow-sm"
          >
            Satu Kecamatan
          </button>
        </div>
      </div>

      {/* Village Chips Selector Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-800 text-sm">
              Desa yang Dibandingkan ({selectedVillages.length}/4 Desa)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Pilih 2 hingga 4 desa untuk komparasi optimal.</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedVillages.map((v, idx) => {
            const color = VILLAGE_COLORS[idx % VILLAGE_COLORS.length];
            return (
              <div
                key={v.id}
                className="flex items-center gap-3 pl-3.5 pr-2 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 shadow-sm"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: color.stroke }}
                />
                <div>
                  <span className="font-extrabold text-sm">{v.name}</span>
                  <span className="text-xs text-slate-400 ml-1.5">({v.kecamatan})</span>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-white border border-slate-200">
                  {v.overallScore}
                </span>

                {selectedVillages.length > 2 && (
                  <button
                    onClick={() => handleRemoveVillage(v.id)}
                    className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Hapus dari perbandingan"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Village Dropdown */}
          {selectedVillages.length < 4 && (
            <div className="relative">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) handleAddVillage(e.target.value);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-all cursor-pointer focus:outline-none"
              >
                <option value="">+ Tambah Desa Lain...</option>
                {VILLAGES.filter((v) => !selectedVillageIds.includes(v.id)).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.kecamatan}) — Skor {v.overallScore}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Disparity Insight AI Highlight */}
      {disparityAnalysis && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-lg border border-indigo-900/50 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analisis Disparitas Wilayah AI</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">
                Ketimpangan Tertinggi: {disparityAnalysis.category} (Selisih {disparityAnalysis.gap} Poin)
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Terdapat disparitas signifikan antara <span className="text-emerald-400 font-bold">{disparityAnalysis.highestVillage} ({disparityAnalysis.highestScore})</span> dengan <span className="text-rose-400 font-bold">{disparityAnalysis.lowestVillage} ({disparityAnalysis.lowestScore})</span>. Administrator Kabupaten disarankan mengalokasikan program afirmasi bantuan teknis ke wilayah yang tertinggal.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 shrink-0 text-center space-y-1">
              <span className="text-xs text-indigo-200 uppercase font-semibold">Indeks Kesenjangan</span>
              <p className="text-3xl font-black text-white">{disparityAnalysis.gap} <span className="text-xs text-indigo-300">Poin</span></p>
              <span className="text-[11px] text-amber-300 font-medium block">Perlu Intervensi Afirmatif</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Chart: Radar Chart 8 Pilar */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Pemetaan Radar 8 Pilar Ketahanan</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bentuk jaring poligon menggambarkan kekuatan dan kelemahan relatif setiap desa.
            </p>
          </div>
        </div>

        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fill: "#475569", fontSize: 11, fontWeight: 700 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: "#94a3b8", fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#0f172a", 
                  borderRadius: "1rem", 
                  border: "none", 
                  color: "#fff",
                  fontSize: "12px"
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "1rem", fontSize: "12px", fontWeight: 600 }}
              />

              {selectedVillages.map((village, idx) => {
                const color = VILLAGE_COLORS[idx % VILLAGE_COLORS.length];
                return (
                  <Radar
                    key={village.id}
                    name={village.name}
                    dataKey={village.name}
                    stroke={color.stroke}
                    fill={color.fill}
                    fillOpacity={0.25}
                    strokeWidth={2.5}
                  />
                );
              })}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Head-to-Head Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg">
            Matriks Komparasi Rinci
          </h3>
          <span className="text-xs text-slate-400 font-medium">Skor dalam skala 0 - 100</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-100 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 px-6">Dimensi / Pilar Ketahanan</th>
                {selectedVillages.map((v, idx) => {
                  const color = VILLAGE_COLORS[idx % VILLAGE_COLORS.length];
                  return (
                    <th key={v.id} className="p-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color.stroke }}
                        />
                        <span className="text-slate-900">{v.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                        Kec. {v.kecamatan}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Overall Score Row */}
              <tr className="bg-slate-50/50 font-bold">
                <td className="p-4 px-6 text-slate-900 font-black">
                  Skor Keseluruhan (Overall)
                </td>
                {selectedVillages.map((v) => {
                  const status = getStatus(v.overallScore);
                  const color = getStatusColor(status);
                  return (
                    <td key={v.id} className="p-4 px-6 text-center">
                      <span className="text-2xl font-black text-slate-900">{v.overallScore}</span>
                      <div className="mt-1">
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                          style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Data Completion Row */}
              <tr>
                <td className="p-4 px-6 text-slate-600 font-semibold">
                  Kelengkapan Data
                </td>
                {selectedVillages.map((v) => (
                  <td key={v.id} className="p-4 px-6 text-center font-bold text-slate-800">
                    {v.dataCompletion}%
                  </td>
                ))}
              </tr>

              {/* 8 Categories Breakdown */}
              {CATEGORIES.map((cat, catIdx) => {
                const scores = selectedVillages.map((v) => v.scores[catIdx] || 0);
                const maxScore = Math.max(...scores);
                const minScore = Math.min(...scores);
                const hasDiff = maxScore !== minScore;

                return (
                  <tr key={cat.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 px-6 text-slate-800 font-bold flex items-center justify-between">
                      <span>{cat.label}</span>
                      <span className="text-xs text-slate-400 font-normal">Pilar {cat.id}</span>
                    </td>

                    {selectedVillages.map((v) => {
                      const score = v.scores[catIdx] || 0;
                      const isHighest = hasDiff && score === maxScore;
                      const isLowest = hasDiff && score === minScore;

                      return (
                        <td key={v.id} className="p-4 px-6 text-center">
                          <div className="inline-flex items-center gap-1.5 font-black text-sm">
                            <span className={
                              isHighest ? "text-emerald-600 font-black" :
                              isLowest ? "text-rose-600 font-black" :
                              "text-slate-800"
                            }>
                              {score}
                            </span>
                            {isHighest && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                            {isLowest && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                          </div>

                          <div className="h-1.5 w-20 mx-auto bg-slate-100 rounded-full overflow-hidden mt-1.5">
                            <div
                              className={`h-full rounded-full ${
                                score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
