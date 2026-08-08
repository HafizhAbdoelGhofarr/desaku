"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { VILLAGES, CATEGORIES, getStatus, getStatusColor, getStatusLabel } from "@/lib/data/sdgsData";
import { 
  Calculator, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCcw, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Bookmark 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DesaWhatIfPage() {
  const { user } = useAuth();

  // Find the single locked village for the authenticated village staff
  const currentVillage = useMemo(() => {
    return VILLAGES.find((v) => v.id === user?.villageId) || VILLAGES[0];
  }, [user]);

  // Sliders state initialized to the village's verified 8-pillar scores
  const [sliderValues, setSliderValues] = useState<number[]>(() => [...currentVillage.scores]);
  const [scenarioName, setScenarioName] = useState("Rencana Alokasi Dana Desa TA 2027");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Recalculate simulated score (WSM equal weights)
  const simulatedOverallScore = useMemo(() => {
    const sum = sliderValues.reduce((a, b) => a + b, 0);
    return Math.round(sum / sliderValues.length);
  }, [sliderValues]);

  const scoreDiff = simulatedOverallScore - currentVillage.overallScore;
  const currentStatus = getStatus(currentVillage.overallScore);
  const simStatus = getStatus(simulatedOverallScore);
  const currentColor = getStatusColor(currentStatus);
  const simColor = getStatusColor(simStatus);

  // Reset sliders to original verified data
  const handleReset = () => {
    setSliderValues([...currentVillage.scores]);
    setSavedSuccess(false);
  };

  const handleSliderChange = (index: number, val: number) => {
    const next = [...sliderValues];
    next[index] = val;
    setSliderValues(next);
    setSavedSuccess(false);
  };

  // Chart data comparing original vs simulated
  const chartData = useMemo(() => {
    return CATEGORIES.map((cat, i) => ({
      category: cat.label,
      "Kondisi Aktual": currentVillage.scores[i],
      "Hasil Simulasi": sliderValues[i],
    }));
  }, [currentVillage, sliderValues]);

  // AI Causal impact insights based on changes
  const aiImpactInsights = useMemo(() => {
    const changes: { name: string; delta: number }[] = [];
    CATEGORIES.forEach((cat, i) => {
      const delta = sliderValues[i] - currentVillage.scores[i];
      if (delta !== 0) {
        changes.push({ name: cat.label, delta });
      }
    });

    if (changes.length === 0) {
      return {
        summary: "Belum ada intervensi indikator yang disimulasikan. Geser slider indikator di bawah untuk melihat estimasi perubahan ketahanan desa.",
        recommendations: [
          "Fokuskan alokasi anggaran pada pilar dengan skor di bawah 60% untuk akselerasi ketahanan.",
          "Intervensi simultan pada Infrastruktur dan Kesehatan umumnya memberikan efek domino tercepat pada pertumbuhan Ekonomi desa.",
        ],
      };
    }

    const topGain = [...changes].sort((a, b) => b.delta - a.delta)[0];
    return {
      summary: `Skenario intervensi ini memproyeksikan kenaikan skor keseluruhan sebesar ${scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} poin (dari ${currentVillage.overallScore} menjadi ${simulatedOverallScore}), dengan peningkatan terbesar pada pilar ${topGain.name} (+${topGain.delta}%).`,
      recommendations: [
        `Peningkatan pada sektor ${topGain.name} diestimasi mempercepat pemulihan ekonomi lokal dan menurunkan beban pengeluaran keluarga pra-sejahtera.`,
        "Pastikan pengadaan dan pelaksanaan program selaras dengan dokumen RKPDes dan diverifikasi berkala oleh Administrator.",
      ],
    };
  }, [sliderValues, currentVillage, scoreDiff, simulatedOverallScore]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header with Village Lock Identity Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Simulasi Kebijakan Desa (KF-09)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            What-If Policy Simulator
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Eksperimen skenario alokasi program pembangunan dan estimasi dampaknya terhadap skor ketahanan desa.
          </p>
        </div>

        {/* Single-Village Locked Badge */}
        <div className="flex items-center gap-3 bg-white p-3.5 px-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm">
            DESA
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-sm">{currentVillage.name}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-400">Kecamatan {currentVillage.kecamatan} &bull; Data Terkunci</p>
          </div>
        </div>
      </div>

      {/* Top Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Score */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Kondisi Terverifikasi</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900">{currentVillage.overallScore}</span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <span
              className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold border"
              style={{ backgroundColor: currentColor.bg, color: currentColor.text, borderColor: currentColor.border }}
            >
              Status: {getStatusLabel(currentStatus)}
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* Simulated Score */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Proyeksi Hasil Simulasi</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900">{simulatedOverallScore}</span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <span
              className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold border"
              style={{ backgroundColor: simColor.bg, color: simColor.text, borderColor: simColor.border }}
            >
              Status: {getStatusLabel(simStatus)}
            </span>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
            <Calculator className="w-6 h-6" />
          </div>
        </div>

        {/* Delta Change */}
        <div className={`p-6 rounded-3xl border shadow-sm flex items-center justify-between ${
          scoreDiff > 0 
            ? "bg-emerald-50/70 border-emerald-100" 
            : scoreDiff < 0 
            ? "bg-rose-50/70 border-rose-100" 
            : "bg-slate-50 border-slate-100"
        }`}>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Estimasi Perubahan (Delta)</p>
            <div className="flex items-center gap-1.5 mt-2">
              {scoreDiff > 0 ? (
                <ArrowUpRight className="w-6 h-6 text-emerald-600 font-bold" />
              ) : scoreDiff < 0 ? (
                <ArrowDownRight className="w-6 h-6 text-rose-600 font-bold" />
              ) : (
                <ArrowRight className="w-6 h-6 text-slate-400" />
              )}
              <span className={`text-3xl font-black ${
                scoreDiff > 0 ? "text-emerald-700" : scoreDiff < 0 ? "text-rose-700" : "text-slate-700"
              }`}>
                {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} Poin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {scoreDiff > 0 ? "Peningkatan Ketahanan Positif" : scoreDiff < 0 ? "Penurunan Skor" : "Kondisi Tetap"}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-6 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Parameter Indikator 8 Pilar</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ubah estimasi target capaian indikator pembangunan</p>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">Target Nilai (0-100)</span>
          </div>

          <div className="space-y-5">
            {CATEGORIES.map((cat, idx) => {
              const val = sliderValues[idx];
              const originalVal = currentVillage.scores[idx];
              const diff = val - originalVal;

              return (
                <div key={cat.id} className="space-y-2 p-3 rounded-2xl hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{cat.label}</span>
                    <div className="flex items-center gap-2">
                      {diff !== 0 && (
                        <span className={`text-[11px] font-bold ${diff > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {diff > 0 ? `+${diff}` : diff}
                        </span>
                      )}
                      <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {val}%
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => handleSliderChange(idx, Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Nilai Aktual: {originalVal}%</span>
                    <span>Target: {val}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Scenario Box */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-700">Nama Skenario Kebijakan:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                onClick={() => setSavedSuccess(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5" />
                Simpan Skenario
              </button>
            </div>
            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Skenario &quot;{scenarioName}&quot; berhasil disimpan sebagai bahan telaah Musrenbangdes!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Comparison & AI Narrative */}
        <div className="lg:col-span-6 space-y-6">
          {/* Comparison Bar Chart */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Perbandingan Capaian Antar Pilar</h3>
            <p className="text-xs text-slate-400">Komparasi nilai kondisi saat ini vs hasil simulasi per pilar</p>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="Kondisi Aktual" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Hasil Simulasi" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Narrative & Reasoning Box */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-7 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Analisis Dampak Kebijakan AI</h4>
                <p className="text-[11px] text-emerald-300">Penalaran kausalitas intervensi indikator SDGs Desa</p>
              </div>
            </div>

            <p className="text-xs text-emerald-100 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
              {aiImpactInsights.summary}
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Rekomendasi Implementasi Strategis:
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {aiImpactInsights.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
