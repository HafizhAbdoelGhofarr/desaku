"use client";

import { useState, useMemo } from "react";
import { 
  VILLAGES, 
  CATEGORIES, 
  INDICATORS, 
  CITIZEN_REPORTS, 
  type CitizenReport, 
  getStatus, 
  getStatusColor, 
  getStatusLabel 
} from "@/lib/data/sdgsData";
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  MessageSquarePlus, 
  ThumbsUp, 
  MapPin, 
  CheckCircle2, 
  X, 
  Send, 
  ChevronRight, 
  BarChart3, 
  MessageCircle, 
  AlertCircle,
  Map
} from "lucide-react";
import VillageMap from "@/components/VillageMap";

export default function PublikSkorPage() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<"skor" | "peta" | "suara">("skor");

  // Filters for Skor
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Selected Village Modal for detail view
  const [selectedVillage, setSelectedVillage] = useState<typeof VILLAGES[0] | null>(null);

  // Citizen reports state
  const [reports, setReports] = useState<CitizenReport[]>(CITIZEN_REPORTS);
  const [selectedReportCat, setSelectedReportCat] = useState<string>("all");
  const [reportVillageFilter, setReportVillageFilter] = useState<string>("all");
  
  // New Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newVillage, setNewVillage] = useState(VILLAGES[0].name);
  const [newCatId, setNewCatId] = useState(4); // default Infrastruktur
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Extract unique kecamatans
  const kecamatans = useMemo(() => {
    return Array.from(new Set(VILLAGES.map((v) => v.kecamatan)));
  }, []);

  // Filtered & Sorted Villages for leaderboard
  const filteredVillages = useMemo(() => {
    return VILLAGES.filter((v) => {
      const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKecamatan = selectedKecamatan === "all" || v.kecamatan === selectedKecamatan;
      const villageStatus = getStatus(v.overallScore);
      const matchStatus = selectedStatus === "all" || villageStatus === selectedStatus;
      return matchSearch && matchKecamatan && matchStatus;
    }).sort((a, b) => b.overallScore - a.overallScore);
  }, [searchQuery, selectedKecamatan, selectedStatus]);

  // Aggregate stats
  const avgKabupatenScore = useMemo(() => {
    return Math.round(VILLAGES.reduce((acc, v) => acc + v.overallScore, 0) / VILLAGES.length);
  }, []);

  const totalVerifiedIndicators = 48; // Total indikator terverifikasi

  // Filtered Citizen Reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchCat = selectedReportCat === "all" || r.catId === Number(selectedReportCat);
      const matchVillage = reportVillageFilter === "all" || r.village === reportVillageFilter;
      return matchCat && matchVillage;
    });
  }, [reports, selectedReportCat, reportVillageFilter]);

  // Handle Upvote
  const handleUpvote = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  // Handle Submit Report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newLocation) return;

    const matchedVillage = VILLAGES.find((v) => v.name === newVillage);
    const newReportItem: CitizenReport = {
      id: `rep-${Date.now()}`,
      village: newVillage,
      kecamatan: matchedVillage?.kecamatan || "Kabupaten",
      catId: Number(newCatId),
      title: newTitle,
      description: newDesc,
      location: newLocation,
      author: isAnonymous ? "Warga Anonim" : newAuthor.trim() || "Warga Setempat",
      submittedAt: "Baru saja",
      status: "terkirim",
      upvotes: 1,
    };

    setReports([newReportItem, ...reports]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsReportModalOpen(false);
      // Reset form
      setNewTitle("");
      setNewDesc("");
      setNewLocation("");
      setNewAuthor("");
      setIsAnonymous(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner / Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-8 md:p-10 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Terbuka & Terverifikasi Administrator</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Transparansi Indeks Ketahanan & Suara Warga
          </h1>

          <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
            Pantau capaian 8 pilar ketahanan desa di seluruh kabupaten dan salurkan aspirasi pembangunan langsung dari lapangan.
          </p>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Rata-Rata Kabupaten</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{avgKabupatenScore} <span className="text-xs text-emerald-300">/ 100</span></p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Desa Terpantau</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{VILLAGES.length} <span className="text-xs text-emerald-300">Desa</span></p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Indikator Terverifikasi</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{totalVerifiedIndicators} <span className="text-xs text-emerald-300">Valid</span></p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Aspirasi Warga</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{reports.length} <span className="text-xs text-emerald-300">Aspirasi</span></p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("skor")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "skor"
                ? "bg-white text-emerald-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Peringkat & Kartu Desa</span>
          </button>

          <button
            onClick={() => setActiveTab("peta")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "peta"
                ? "bg-white text-emerald-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Peta Spasial ({filteredVillages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("suara")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "suara"
                ? "bg-white text-emerald-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Suara Warga ({reports.length})</span>
          </button>
        </div>

        {/* Action Button for Suara Warga */}
        {activeTab === "suara" && (
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-200 transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Sampaikan Suara Warga</span>
          </button>
        )}
      </div>

      {/* TAB 2: PETA SPASIAL KETAHANAN DESA */}
      {activeTab === "peta" && (
        <div className="space-y-6">
          {/* Quick Filter Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span className="font-bold">Sebaran Geografis Ketahanan Desa</span>
              <span className="text-xs text-slate-400">({filteredVillages.length} Desa Terpetakan)</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <VillageMap
              villages={filteredVillages}
              onSelectVillage={(v) => setSelectedVillage(v)}
              height="550px"
            />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Baik (&ge;70)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Sedang (40-69)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Rendah (&lt;40)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                *Klik marker pin desa untuk melihat rincian 8 pilar dan membuka modal data resmi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: SKOR & PERINGKAT DESA */}
      {activeTab === "skor" && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama desa atau kecamatan..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase">Kecamatan:</span>
                <select
                  value={selectedKecamatan}
                  onChange={(e) => setSelectedKecamatan(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Kecamatan</option>
                  {kecamatans.map((kec) => (
                    <option key={kec} value={kec}>
                      {kec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-400 uppercase">Kategori:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="hijau">Baik (≥70)</option>
                  <option value="kuning">Sedang (40-69)</option>
                  <option value="merah">Rendah (&lt;40)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leaderboard Table & Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredVillages.map((v, index) => {
              const status = getStatus(v.overallScore);
              const color = getStatusColor(status);
              const rank = index + 1;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVillage(v)}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          rank === 1 ? "bg-amber-100 text-amber-800 border border-amber-300" :
                          rank === 2 ? "bg-slate-100 text-slate-700 border border-slate-300" :
                          rank === 3 ? "bg-orange-100 text-orange-800 border border-orange-300" :
                          "bg-slate-50 text-slate-500"
                        }`}>
                          #{rank}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                            {v.name}
                          </h3>
                          <p className="text-xs text-slate-400">Kec. {v.kecamatan}</p>
                        </div>
                      </div>

                      <span 
                        className="px-2.5 py-1 rounded-full text-xs font-bold border"
                        style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    {/* Overall Score Badge */}
                    <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-slate-500">Skor Ketahanan:</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">{v.overallScore}</span>
                        <span className="text-xs text-slate-400 font-medium">/ 100</span>
                      </div>
                    </div>

                    {/* 8 Pilar Mini Bars */}
                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                        <span>Capaian 8 Pilar</span>
                        <span>Kelengkapan {v.dataCompletion}%</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-1.5">
                        {CATEGORIES.map((cat, i) => {
                          const s = v.scores[i] || 0;
                          return (
                            <div key={cat.id} className="space-y-1" title={`${cat.label}: ${s}/100`}>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    s >= 70 ? "bg-emerald-500" : s >= 40 ? "bg-amber-500" : "bg-rose-500"
                                  }`}
                                  style={{ width: `${s}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium truncate text-center">
                                {cat.label.split(" ")[0]}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                    <span>Lihat Detail Indikator</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredVillages.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-slate-700">Tidak ada desa yang cocok dengan filter pencarian.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedKecamatan("all");
                  setSelectedStatus("all");
                }}
                className="text-xs text-emerald-600 font-bold underline"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUARA WARGA (PARTISIPASI PUBLIK) */}
      {activeTab === "suara" && (
        <div className="space-y-6">
          {/* Sub-header Suara Warga */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-400 uppercase">Desa:</span>
                <select
                  value={reportVillageFilter}
                  onChange={(e) => setReportVillageFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Desa</option>
                  {VILLAGES.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-400 uppercase">Pilar Masalah:</span>
                <select
                  value={selectedReportCat}
                  onChange={(e) => setSelectedReportCat(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Pilar</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-800">{filteredReports.length}</span> laporan warga terverifikasi publik
            </div>
          </div>

          {/* List of Citizen Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report) => {
              const cat = CATEGORIES.find((c) => c.id === report.catId);
              const statusBadge =
                report.status === "ditindaklanjuti"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : report.status === "ditinjau"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-100 text-slate-700 border-slate-200";

              const statusLabel =
                report.status === "ditindaklanjuti"
                  ? "Ditindaklanjuti Desa"
                  : report.status === "ditinjau"
                  ? "Sedang Ditinjau"
                  : "Terkirim";

              return (
                <div
                  key={report.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-200 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                          {cat?.label || "Umum"}
                        </span>
                        <span className="text-xs text-slate-400">• {report.submittedAt}</span>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge}`}>
                        {statusLabel}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {report.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-700">{report.village}</span>
                      <span>—</span>
                      <span>{report.location}</span>
                    </div>

                    {/* Respon Desa / DPMD jika ada */}
                    {report.responseNote && (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 space-y-1">
                        <p className="font-bold flex items-center gap-1 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Tanggapan Pemerintah Desa:
                        </p>
                        <p className="leading-relaxed">{report.responseNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer Card */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Oleh: {report.author}</span>
                    <button
                      onClick={() => handleUpvote(report.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold border border-slate-200 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Dukung ({report.upvotes})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredReports.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <MessageCircle className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-slate-700">Belum ada aspirasi warga untuk filter ini.</p>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Jadilah yang Pertama Bersuara
              </button>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL: RINCIAN 8 PILAR DESA */}
      {selectedVillage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Header Modal */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 border border-white/10">
                  Kecamatan {selectedVillage.kecamatan}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                  {selectedVillage.name}
                </h2>
                <p className="text-xs text-emerald-200/90 mt-1">
                  Detail capaian 8 pilar ketahanan yang telah diverifikasi resmi oleh Administrator Kabupaten.
                </p>
              </div>

              <button
                onClick={() => setSelectedVillage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-xs text-slate-500 font-semibold">Skor Total</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{selectedVillage.overallScore}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-xs text-slate-500 font-semibold">Status Ketahanan</p>
                  <p className="text-sm font-black text-emerald-700 mt-2 uppercase">
                    {getStatusLabel(getStatus(selectedVillage.overallScore))}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-xs text-slate-500 font-semibold">Kelengkapan Data</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{selectedVillage.dataCompletion}%</p>
                </div>
              </div>

              {/* 8 Pilar Detail */}
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-4">Rincian Capaian 8 Pilar</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CATEGORIES.map((cat, i) => {
                    const score = selectedVillage.scores[i] || 0;
                    return (
                      <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{cat.label}</span>
                          <span className="font-black text-slate-900">{score}/100</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-rose-500"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Indicators Highlight */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-base mb-3">Indikator Lapangan Kunci</h4>
                <div className="space-y-2 text-xs">
                  {INDICATORS.slice(0, 4).map((ind) => (
                    <div key={ind.id} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-slate-700">
                      <div>
                        <p className="font-bold text-slate-800">{ind.label}</p>
                        <p className="text-[11px] text-slate-500">{ind.description}</p>
                      </div>
                      <span className="font-bold text-emerald-800 text-right shrink-0 ml-2">
                        Satuan: {ind.unit} (Terverifikasi Admin)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedVillage(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INPUT SUARA WARGA BARU */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white">Sampaikan Suara Warga</h3>
                <p className="text-xs text-emerald-200 mt-1">
                  Kirimkan aspirasi atau laporan kondisi riil di desa Anda untuk diverifikasi tim desa & Administrator Kabupaten.
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pilih Desa
                </label>
                <select
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                >
                  {VILLAGES.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} (Kec. {v.kecamatan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori Pilar Ketahanan
                </label>
                <select
                  value={newCatId}
                  onChange={(e) => setNewCatId(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Aspirasi / Laporan *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Perbaikan Saluran Air RW 02"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Lokasi / Dusun / RT-RW *
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Contoh: Dusun 1 RT 03 / RW 01"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Isi Laporan & Kondisi Lapangan *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Jelaskan kendala riil di lapangan serta harapan tindak lanjut..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Pengirim
                </label>
                <input
                  type="text"
                  disabled={isAnonymous}
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder={isAnonymous ? "Warga Anonim" : "Nama lengkap / inisial"}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Kirim sebagai Warga Anonim (Identitas dirahasiakan)</span>
                </label>
              </div>

              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Aspirasi berhasil dikirim dan masuk ke sistem!</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-200 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Aspirasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
