"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
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
  CheckCircle2
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

export default function DesaWhatIfPage() {
  const { user } = useAuth();

  // Locked village for authenticated village staff
  const currentVillage = useMemo(() => {
    return VILLAGES.find((v) => v.id === user?.villageId) || VILLAGES[0];
  }, [user]);

  // Form State - Direct User Input
  const [programTitle, setProgramTitle] = useState("Pembangunan Jalan Usaha Tani dan Irigasi Sawah");
  const [budget, setBudget] = useState<number>(100_000_000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);

  // AI Causal Result
  const aiResult = useMemo(() => {
    return simulatePolicyImpact(
      programTitle || "Program Pembangunan Desa",
      budget || 0,
      "Dusun Terpilih",
      currentVillage.scores
    );
  }, [programTitle, budget, currentVillage.scores]);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasSimulated(true);
    }, 300);
  };

  const handleReset = () => {
    setProgramTitle("Pembangunan Jalan Usaha Tani dan Irigasi Sawah");
    setBudget(100_000_000);
    setSavedSuccess(false);
    setHasSimulated(false);
  };

  // Status Colors
  const currentStatus = getStatus(currentVillage.overallScore);
  const simStatus = getStatus(aiResult.newOverallScore);
  const currentColor = getStatusColor(currentStatus);
  const simColor = getStatusColor(simStatus);

  // Chart Data
  const chartData = useMemo(() => {
    return CATEGORIES.map((cat, i) => ({
      name: cat.label.split(" ")[0],
      fullName: cat.label,
      "Kondisi Saat Ini": currentVillage.scores[i],
      "Hasil Simulasi": aiResult.simulatedScores[i],
    }));
  }, [currentVillage, aiResult.simulatedScores]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* 1. Header Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulasi Kebijakan AI</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            What-If Policy Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ketik usulan program & anggaran. AI akan menganalisis pilar yang terdampak dan menghitung efek domino kausalitasnya.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 px-4 rounded-xl border border-slate-200 self-start sm:self-auto">
          <Building2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <p className="text-xs font-black text-slate-900">{currentVillage.name}</p>
            <p className="text-[11px] text-slate-400">Kec. {currentVillage.kecamatan}</p>
          </div>
        </div>
      </div>

      {/* 2. Input Langsung Usulan Program & Anggaran */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Rencana Program / Intervensi Kebijakan Desa:
            </label>
            <input
              type="text"
              value={programTitle}
              onChange={(e) => {
                setProgramTitle(e.target.value);
                setHasSimulated(false);
              }}
              placeholder="Ketik rencana program (contoh: Pengaspalan jalan dusun, revitalisasi posyandu, bantuan permodalan BUMDes...)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Estimasi Anggaran (Rp):
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSimulate}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 flex items-center gap-1.5"
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
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Belum Ada Hasil Simulasi</h3>
          <p className="text-slate-500 max-w-md text-sm">
            Silakan masukkan nama program dan estimasi anggaran di atas, lalu klik tombol <span className="font-bold text-slate-700">Simulasi</span> untuk melihat proyeksi dampaknya terhadap pilar desa.
          </p>
        </div>
      ) : (
        <>
          {/* 3. Ringkasan Skor & Dampak Intervensi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Baseline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Skor Baseline</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{currentVillage.overallScore}</div>
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

        {/* Proyeksi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Proyeksi AI</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{aiResult.newOverallScore}</div>
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
              style={{ backgroundColor: simColor.bg, color: simColor.text, borderColor: simColor.border }}
            >
              {getStatusLabel(simStatus)}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Delta */}
        <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase">Kenaikan Total</span>
            <div className="flex items-center gap-1.5 mt-1 text-3xl font-black text-emerald-700">
              <ArrowUpRight className="w-7 h-7 font-bold" />
              <span>+{aiResult.deltaOverallScore} Poin</span>
            </div>
            <span className="text-[11px] text-emerald-800 font-semibold">
              Efisiensi: {aiResult.roiMetric}
            </span>
          </div>
          <button
            onClick={handleReset}
            title="Reset formulir"
            className="p-2.5 bg-white hover:bg-emerald-100 rounded-xl border border-emerald-200 text-emerald-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Rantai Dampak Kausal & Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Rantai Dampak Kausal (Left) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Rantai Dampak Kausalitas AI
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Primer & Efek Domino</span>
          </div>

          {/* Pilar Utama */}
          <div className="p-4 rounded-xl bg-emerald-900 text-white space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-500/30 text-emerald-200 rounded">
                Dampak Langsung
              </span>
              <span className="font-black text-sm text-emerald-300">
                +{aiResult.primaryPillar.delta} Poin
              </span>
            </div>
            <h4 className="font-bold text-sm text-white pt-1">{aiResult.primaryPillar.name}</h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {aiResult.primaryPillar.rationale}
            </p>
          </div>

          {/* Efek Domino Turunan */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Efek Domino ke Pilar Terkait:
            </span>
            <div className="space-y-2">
              {aiResult.rippleEffects.map((r) => (
                <div key={r.pillarId} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800">{r.pillarName}:</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{r.rationale}</p>
                  </div>
                  <span className="font-extrabold text-emerald-700 shrink-0 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{r.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Narasi AI Singkat */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1">💡 Kesimpulan AI:</span>
            {aiResult.causalSummary}
          </div>
        </div>

        {/* Grafik Komparasi (Right) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Perbandingan Capaian 8 Pilar SDGs Desa
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Kondisi saat ini vs proyeksi hasil intervensi</p>
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
                <Bar dataKey="Kondisi Saat Ini" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Hasil Simulasi" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tombol Simpan Dokumen */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Gunakan untuk usulan RKPDes / APBDes</span>
            <button
              onClick={() => {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2500);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{savedSuccess ? "Tersimpan!" : "Simpan Hasil Simulasi"}</span>
            </button>
          </div>
        </div>

      </div>
        </>
      )}

    </div>
  );
}
