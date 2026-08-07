"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { VILLAGES, getStatus, getStatusColor } from "@/lib/data/sdgsData";
import { MapPin, TrendingUp, AlertTriangle, CheckCircle2, Filter, Building2 } from "lucide-react";

export default function DpmdDashboard() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");

  // Extract unique kecamatans
  const kecamatans = useMemo(() => {
    return Array.from(new Set(VILLAGES.map((v) => v.kecamatan)));
  }, []);

  // Filtered villages
  const displayedVillages = useMemo(() => {
    if (selectedKecamatan === "all") return VILLAGES;
    return VILLAGES.filter((v) => v.kecamatan === selectedKecamatan);
  }, [selectedKecamatan]);

  // Aggregate metrics
  const averageScore = useMemo(() => {
    if (displayedVillages.length === 0) return 0;
    return Math.round(displayedVillages.reduce((acc, v) => acc + v.overallScore, 0) / displayedVillages.length);
  }, [displayedVillages]);

  const pendingCount = 12;
  const criticalVillages = displayedVillages.filter((v) => getStatus(v.overallScore) === "merah");

  // Data for chart
  const chartData = useMemo(() => {
    return [...displayedVillages]
      .sort((a, b) => b.overallScore - a.overallScore)
      .map((v) => ({
        name: v.name.replace("Desa ", ""),
        fullName: v.name,
        kecamatan: v.kecamatan,
        score: v.overallScore,
        status: getStatus(v.overallScore),
      }));
  }, [displayedVillages]);

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* Header & Kecamatan Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Wilayah Kerja: Kabupaten Bogor</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Administrator Kabupaten</h1>
          <p className="text-slate-500 mt-1">Ringkasan agregat ketahanan seluruh desa dan pemantauan berbasis kecamatan.</p>
        </div>

        {/* Filter Wilayah Kecamatan */}
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-500 uppercase">Filter Kecamatan:</span>
          <select
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Kecamatan ({VILLAGES.length} Desa)</option>
            {kecamatans.map((kec) => {
              const count = VILLAGES.filter((v) => v.kecamatan === kec).length;
              return (
                <option key={kec} value={kec}>
                  Kec. {kec} ({count} Desa)
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Rata-rata Ketahanan" 
          value={`${averageScore}/100`} 
          subtitle={selectedKecamatan === "all" ? "Seluruh Kabupaten" : `Kec. ${selectedKecamatan}`} 
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} 
          color="emerald" 
        />
        <MetricCard 
          title="Desa Terdata" 
          value={`${displayedVillages.length}`} 
          subtitle={`Dari total ${VILLAGES.length} desa`} 
          icon={<MapPin className="w-6 h-6 text-blue-600" />} 
          color="blue" 
        />
        <MetricCard 
          title="Menunggu Verifikasi" 
          value={pendingCount.toString()} 
          subtitle="Indikator butuh review" 
          icon={<CheckCircle2 className="w-6 h-6 text-amber-600" />} 
          color="amber" 
        />
        <MetricCard 
          title="Desa Kritis" 
          value={criticalVillages.length.toString()} 
          subtitle="Skor di bawah 40" 
          icon={<AlertTriangle className="w-6 h-6 text-rose-600" />} 
          color="rose" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Peringkat Ketahanan Desa</h2>
              <p className="text-sm text-slate-500">
                {selectedKecamatan === "all"
                  ? "Skor komposit keseluruhan desa di Kabupaten"
                  : `Menampilkan desa di wilayah Kecamatan ${selectedKecamatan}`}
              </p>
            </div>

            {selectedKecamatan !== "all" && (
              <button
                onClick={() => setSelectedKecamatan("all")}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Tampilkan Semua
              </button>
            )}
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={13} fontWeight={500} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: "#f8fafc"}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={24}>
                  {chartData.map((entry, index) => {
                    const colors = getStatusColor(entry.status);
                    return <Cell key={`cell-${index}`} fill={colors.dot} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Action / Alerts */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Peringatan Desa Kritis</h2>
            <p className="text-xs text-slate-400 mb-6">
              Desa dengan skor &lt;40 yang memerlukan intervensi afirmatif segera dari Administrator.
            </p>
            
            <div className="space-y-4">
              {criticalVillages.map((v) => (
                <div key={v.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex gap-4 items-start">
                  <div className="mt-1 bg-white p-2 rounded-full shadow-sm text-rose-500 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-900 text-sm">{v.name} (Kec. {v.kecamatan})</h4>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                      Skor kritis ({v.overallScore}/100). Sangat tertinggal di infrastruktur & ekonomi.
                    </p>
                  </div>
                </div>
              ))}

              {criticalVillages.length === 0 && (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                  <Building2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Tidak Ada Desa Kritis</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Semua desa di wilayah ini berada pada kategori sedang/baik.</p>
                </div>
              )}
            </div>
          </div>

          <Link
            href="/dpmd/recommendations"
            className="w-full mt-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center text-xs transition-all shadow-md block"
          >
            Lihat Rekomendasi Kebijakan AI &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: "emerald" | "blue" | "amber" | "rose";
}

function MetricCard({ title, value, subtitle, icon, color }: MetricCardProps) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
        <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
      </div>
      <div className={`p-4 rounded-2xl border ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
}
