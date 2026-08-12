"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  getStatus, 
  getStatusColor 
} from "@/lib/data/sdgsData";
import { api } from "@/lib/api";
import { 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Building2, 
  Map, 
  BarChart3,
  Globe2
} from "lucide-react";
import VillageMap from "@/components/VillageMap";

export default function DpmdDashboard() {
  const [villages, setVillages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.villages.getDashboardStats().then((data) => {
      // transform id to string for compatibility with existing components if needed, or keep as number
      // the map component expects id as string in VILLAGES, but we can map it
      setVillages(data.map(v => ({ ...v, id: String(v.id) })));
      setLoading(false);
    }).catch(console.error);
  }, []);

  const provinces = useMemo(() => Array.from(new Set(villages.map(v => v.provinsi))), [villages]);
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  
  const availableKabupatens = useMemo(() => {
    const list = selectedProvince === "all" ? villages : villages.filter(v => v.provinsi === selectedProvince);
    return Array.from(new Set(list.map(v => v.kabupaten)));
  }, [selectedProvince, villages]);
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>("all");

  const availableKecamatans = useMemo(() => {
    let list = villages;
    if (selectedProvince !== "all") list = list.filter(v => v.provinsi === selectedProvince);
    if (selectedKabupaten !== "all") list = list.filter(v => v.kabupaten === selectedKabupaten);
    return Array.from(new Set(list.map(v => v.kecamatan)));
  }, [selectedProvince, selectedKabupaten, villages]);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");

  const [viewMode, setViewMode] = useState<"map" | "chart">("map");

  // Handle Province change
  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov);
    setSelectedKabupaten("all");
    setSelectedKecamatan("all");
  };

  // Handle Kabupaten change
  const handleKabupatenChange = (kab: string) => {
    setSelectedKabupaten(kab);
    setSelectedKecamatan("all");
  };

  // Filtered villages
  const displayedVillages = useMemo(() => {
    return villages.filter((v) => {
      const matchProv = selectedProvince === "all" || v.provinsi === selectedProvince;
      const matchKab = selectedKabupaten === "all" || v.kabupaten === selectedKabupaten;
      const matchKec = selectedKecamatan === "all" || v.kecamatan === selectedKecamatan;
      return matchProv && matchKab && matchKec;
    });
  }, [selectedProvince, selectedKabupaten, selectedKecamatan, villages]);

  // Aggregate metrics
  const averageScore = useMemo(() => {
    if (displayedVillages.length === 0) return 0;
    return Math.round(displayedVillages.reduce((acc, v) => acc + v.overallScore, 0) / displayedVillages.length);
  }, [displayedVillages]);

  const pendingCount = displayedVillages.length * 2;
  const criticalVillages = displayedVillages.filter((v) => getStatus(v.overallScore) === "merah");

  // Data for chart
  const chartData = useMemo(() => {
    return [...displayedVillages]
      .sort((a, b) => b.overallScore - a.overallScore)
      .map((v) => ({
        name: v.name.replace("Desa ", ""),
        fullName: v.name,
        kecamatan: v.kecamatan,
        kabupaten: v.kabupaten,
        score: v.overallScore,
        status: getStatus(v.overallScore),
      }));
  }, [displayedVillages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* Header & Regional Selector Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <Globe2 className="w-3.5 h-3.5" />
              <span>
                Wilayah Kerja: {selectedKabupaten !== "all" ? selectedKabupaten : selectedProvince !== "all" ? selectedProvince : "Seluruh Indonesia"}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Administrator Daerah</h1>
            <p className="text-slate-500 mt-1">Pemantauan capaian 8 pilar ketahanan desa, verifikasi data, dan inferensi AI.</p>
          </div>
        </div>

        {/* Filter Wilayah Nasional (Provinsi -> Kabupaten -> Kecamatan) */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              PROVINSI
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Provinsi ({provinces.length})</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              KABUPATEN / KOTA
            </label>
            <select
              value={selectedKabupaten}
              onChange={(e) => handleKabupatenChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Kabupaten / Kota</option>
              {availableKabupatens.map((kab) => (
                <option key={kab} value={kab}>{kab}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              KECAMATAN
            </label>
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Kecamatan</option>
              {availableKecamatans.map((kec) => (
                <option key={kec} value={kec}>Kec. {kec}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Rata-rata Ketahanan" 
          value={`${averageScore}/100`} 
          subtitle={selectedKecamatan !== "all" ? `Kec. ${selectedKecamatan}` : selectedKabupaten !== "all" ? selectedKabupaten : "Wilayah Terpilih"} 
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} 
          color="emerald" 
        />
        <MetricCard 
          title="Desa Terdata" 
          value={`${displayedVillages.length}`} 
          subtitle={`Dari total ${villages.length} desa nasional`} 
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
        {/* Visual Map & Chart Section */}
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {viewMode === "map" ? "Peta Spasial Ketahanan Desa" : "Peringkat Ketahanan Desa"}
              </h2>
              <p className="text-sm text-slate-500">
                Menampilkan {displayedVillages.length} desa berdasarkan filter wilayah aktif.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl shrink-0">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "map"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                Peta Spasial
              </button>
              <button
                onClick={() => setViewMode("chart")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "chart"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Grafik Batang
              </button>
            </div>
          </div>

          {viewMode === "map" ? (
            <div className="space-y-3">
              <VillageMap villages={displayedVillages} height="430px" />
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
                <span className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Baik (&ge;70)
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Sedang (40-69)
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Rendah (&lt;40)
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">*Klik pin desa untuk rincian 8 pilar</span>
              </div>
            </div>
          ) : (
            <div className="h-[430px]">
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
          )}
        </div>

        {/* Quick Action / Alerts */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Peringatan Desa Kritis</h2>
            <p className="text-xs text-slate-400 mb-6">
              Desa dengan skor &lt;40 memerlukan intervensi kebijakan darurat dan rekomendasi APBDes prioritas.
            </p>

            <div className="space-y-4">
              {criticalVillages.length > 0 ? (
                criticalVillages.map((v) => (
                  <div key={v.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
                      <p className="text-xs text-rose-700 font-medium">Kec. {v.kecamatan} ({v.kabupaten})</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-rose-600">{v.overallScore}</span>
                      <span className="text-xs text-rose-400 block font-bold">SKOR</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-emerald-900">Tidak Ada Desa Kritis</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Semua desa di wilayah terpilih berstatus aman.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <Link
              href="/dpmd/verification"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Verifikasi Indikator</span>
              <span className="px-2 py-0.5 bg-rose-500 rounded-full text-[10px]">{pendingCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  color: "emerald" | "blue" | "amber" | "rose";
}) {
  const bgStyles = {
    emerald: "bg-emerald-50/80 border-emerald-100",
    blue: "bg-blue-50/80 border-blue-100",
    amber: "bg-amber-50/80 border-amber-100",
    rose: "bg-rose-50/80 border-rose-100",
  };

  return (
    <div className={`p-6 rounded-3xl border bg-white shadow-sm flex items-start justify-between`}>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>
      <div className={`p-3.5 rounded-2xl border ${bgStyles[color]}`}>
        {icon}
      </div>
    </div>
  );
}
