"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { VILLAGES, CATEGORIES, getStatus, getStatusColor } from "@/lib/data/sdgsData";
import { MapPin, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function DpmdDashboard() {
  const averageScore = useMemo(() => {
    return Math.round(VILLAGES.reduce((acc, v) => acc + v.overallScore, 0) / VILLAGES.length);
  }, []);

  const pendingCount = 12; // dummy
  const criticalCount = VILLAGES.filter(v => getStatus(v.overallScore) === "merah").length;
  
  // Data for chart
  const chartData = [...VILLAGES].sort((a, b) => b.overallScore - a.overallScore).map(v => ({
    name: v.name.replace("Desa ", ""),
    score: v.overallScore,
    status: getStatus(v.overallScore)
  }));

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Kabupaten</h1>
        <p className="text-slate-500 mt-2">Ringkasan agregat ketahanan seluruh desa di wilayah Anda.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Rata-rata Ketahanan" 
          value={`${averageScore}/100`} 
          subtitle="Indeks komposit kabupaten" 
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} 
          color="emerald" 
        />
        <MetricCard 
          title="Desa Terdata" 
          value={`${VILLAGES.length}`} 
          subtitle="Total desa dalam sistem" 
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
          value={criticalCount.toString()} 
          subtitle="Skor di bawah 40" 
          icon={<AlertTriangle className="w-6 h-6 text-rose-600" />} 
          color="rose" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Peringkat Ketahanan Desa</h2>
              <p className="text-sm text-slate-500">Skor komposit keseluruhan per desa</p>
            </div>
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
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Peringatan Sistem</h2>
          
          <div className="space-y-4 flex-1">
            {VILLAGES.filter(v => getStatus(v.overallScore) === "merah").map(v => (
              <div key={v.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex gap-4 items-start">
                <div className="mt-1 bg-white p-2 rounded-full shadow-sm text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-rose-900">{v.name}</h4>
                  <p className="text-sm text-rose-700 mt-1">Skor kritis ({v.overallScore}/100). Sangat tertinggal di infrastruktur dan ekonomi.</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-4 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors">
            Lihat Analisa Lengkap
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }: any) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 border-emerald-100 group-hover:border-emerald-200",
    blue: "bg-blue-50 border-blue-100 group-hover:border-blue-200",
    amber: "bg-amber-50 border-amber-100 group-hover:border-amber-200",
    rose: "bg-rose-50 border-rose-100 group-hover:border-rose-200",
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 group ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
        <div className="font-semibold text-slate-800 mt-1">{title}</div>
        <div className="text-sm text-slate-500 mt-1">{subtitle}</div>
      </div>
    </div>
  );
}
