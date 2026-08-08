"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  VILLAGES, 
  CATEGORIES, 
  INDICATORS, 
  CITIZEN_REPORTS, 
  type CitizenReport, 
  getStatus, 
  getStatusColor, 
  getStatusLabel,
  getProvinces,
  getKabupatens,
  getKecamatans
} from "@/lib/data/sdgsData";
import { api } from "@/lib/api";
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
  Map,
  Globe2,
  Building
} from "lucide-react";
import VillageMap from "@/components/VillageMap";

export default function PublikSkorPage() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<"skor" | "peta" | "suara">("skor");

  // Regional Filters for Skor
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>("all");
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

  // Fetch reports from backend
  const fetchCitizenReports = async () => {
    try {
      const res = await api.reports.getAll();
      if (Array.isArray(res) && res.length > 0) {
        const mapped: CitizenReport[] = res.map((r: {
          id: number;
          village_id?: number;
          village_name?: string;
          kecamatan?: string;
          cat_id?: number;
          title?: string;
          description?: string;
          location?: string;
          author?: string;
          status?: "terkirim" | "ditinjau" | "ditindaklanjuti";
          upvotes?: number;
          response_note?: string;
          created_at?: string;
        }) => {
          const vObj = VILLAGES.find(v => v.name.toLowerCase() === (r.village_name || "").toLowerCase()) || VILLAGES[0];
          const categoryObj = CATEGORIES.find(c => c.id === (r.cat_id || 1));

          return {
            id: `rep-${r.id}`,
            backendId: r.id,
            village: r.village_name || vObj.name,
            villageName: r.village_name || vObj.name,
            villageId: vObj.id,
            kecamatan: r.kecamatan || vObj.kecamatan,
            catId: r.cat_id || 1,
            category: categoryObj?.label.toLowerCase() || "infrastruktur",
            title: r.title || "Aspirasi Warga",
            description: r.description || "",
            location: r.location || vObj.name,
            author: r.author || "Warga Desa",
            submittedAt: r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric"
            }) : "Baru saja",
            createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID") : "Baru saja",
            status: r.status || "terkirim",
            upvotes: r.upvotes || 0,
            adminResponse: r.response_note || undefined,
          };
        });
        setReports(mapped);
      }
    } catch (err) {
      console.warn("Using fallback reports", err);
    }
  };

  useEffect(() => {
    fetchCitizenReports();
  }, []);

  // Unique Regional Lists
  const provinces = useMemo(() => getProvinces(), []);
  
  const availableKabupatens = useMemo(() => {
    return getKabupatens(selectedProvince);
  }, [selectedProvince]);

  const availableKecamatans = useMemo(() => {
    return getKecamatans(selectedProvince, selectedKabupaten);
  }, [selectedProvince, selectedKabupaten]);

  // Handle Province filter change
  const handleProvinceFilter = (prov: string) => {
    setSelectedProvince(prov);
    setSelectedKabupaten("all");
    setSelectedKecamatan("all");
  };

  // Handle Kabupaten filter change
  const handleKabupatenFilter = (kab: string) => {
    setSelectedKabupaten(kab);
    setSelectedKecamatan("all");
  };

  // Filtered & Sorted Villages for leaderboard & map
  const filteredVillages = useMemo(() => {
    return VILLAGES.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        v.name.toLowerCase().includes(q) || 
        v.kecamatan.toLowerCase().includes(q) ||
        v.kabupaten.toLowerCase().includes(q) ||
        v.provinsi.toLowerCase().includes(q);

      const matchProv = selectedProvince === "all" || v.provinsi === selectedProvince;
      const matchKab = selectedKabupaten === "all" || v.kabupaten === selectedKabupaten;
      const matchKec = selectedKecamatan === "all" || v.kecamatan === selectedKecamatan;

      const villageStatus = getStatus(v.overallScore);
      const matchStatus = selectedStatus === "all" || villageStatus === selectedStatus;

      return matchSearch && matchProv && matchKab && matchKec && matchStatus;
    }).sort((a, b) => b.overallScore - a.overallScore);
  }, [searchQuery, selectedProvince, selectedKabupaten, selectedKecamatan, selectedStatus]);

  // Aggregate stats
  const avgFilteredScore = useMemo(() => {
    if (filteredVillages.length === 0) return 0;
    return Math.round(filteredVillages.reduce((acc, v) => acc + v.overallScore, 0) / filteredVillages.length);
  }, [filteredVillages]);

  const totalVerifiedIndicators = filteredVillages.length * 6;

  // Filtered Citizen Reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchCat = selectedReportCat === "all" || r.catId === Number(selectedReportCat);
      const matchVillage = reportVillageFilter === "all" || r.village === reportVillageFilter;
      return matchCat && matchVillage;
    });
  }, [reports, selectedReportCat, reportVillageFilter]);

  // Handle Upvote
  const handleUpvote = async (id: string) => {
    const targetReport = reports.find(r => r.id === id);
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );

    if (targetReport?.backendId) {
      try {
        await api.reports.upvote(targetReport.backendId);
      } catch (err) {
        console.warn("Failed to persist upvote", err);
      }
    }
  };

  // Handle Submit Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newLocation) return;

    const matchedVillage = VILLAGES.find((v) => v.name === newVillage);
    const catLabel = CATEGORIES.find((c) => c.id === Number(newCatId))?.label.toLowerCase() || "infrastruktur";
    const vId = matchedVillage?.id ? parseInt(matchedVillage.id.replace(/\D/g, ""), 10) || 1 : 1;

    let createdBackendId: number | undefined = undefined;

    try {
      const res = await api.reports.create({
        village_id: vId,
        village_name: newVillage,
        kecamatan: matchedVillage?.kecamatan || "Wilayah",
        cat_id: Number(newCatId),
        title: newTitle,
        description: newDesc,
        location: newLocation,
        author: isAnonymous ? "Warga Desa (Anonim)" : (newAuthor || "Warga Desa"),
        status: "terkirim"
      });
      if (res && res.id) {
        createdBackendId = res.id;
      }
    } catch (err) {
      console.warn("Failed to persist report to backend", err);
    }

    const newReportItem: CitizenReport = {
      id: `rep-${createdBackendId || Date.now()}`,
      backendId: createdBackendId,
      village: newVillage,
      kecamatan: matchedVillage?.kecamatan || "Wilayah",
      catId: Number(newCatId),
      category: catLabel,
      title: newTitle,
      description: newDesc,
      location: newLocation,
      author: isAnonymous ? "Warga Desa (Anonim)" : newAuthor || "Warga",
      submittedAt: "Baru saja",
      createdAt: "Baru saja",
      status: "terkirim",
      upvotes: 1,
    };

    setReports([newReportItem, ...reports]);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsReportModalOpen(false);
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
            <Globe2 className="w-4 h-4" />
            <span>Portal Nasional Transparansi Desa Indonesia</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Indeks Ketahanan Desa & Suara Warga
          </h1>

          <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
            Pantau capaian 8 pilar ketahanan desa dari seluruh provinsi dan kabupaten di Indonesia serta salurkan aspirasi pembangunan langsung dari lapangan.
          </p>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Rata-Rata Skor</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{avgFilteredScore} <span className="text-xs text-emerald-300">/ 100</span></p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Desa Terpantau</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{filteredVillages.length} <span className="text-xs text-emerald-300">/ {VILLAGES.length} Desa</span></p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Indikator Terverifikasi</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{totalVerifiedIndicators} <span className="text-xs text-emerald-300">Valid</span></p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Aspirasi Warga</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{reports.length} <span className="text-xs text-emerald-300">Laporan</span></p>
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
            <span>Peringkat & Skor ({filteredVillages.length})</span>
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
            <span>Peta Spasial Indonesia ({filteredVillages.length})</span>
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
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-emerald-200 w-full sm:w-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Kirim Aspirasi / Laporan Warga</span>
        </button>
      </div>

      {/* FILTER BAR NASIONAL (PROVINSI -> KABUPATEN -> KECAMATAN -> STATUS) */}
      {(activeTab === "skor" || activeTab === "peta") && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          
          {/* Row 1: Search bar */}
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama desa, kecamatan, kabupaten, atau provinsi di Indonesia..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Row 2: Cascading Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Filter 1: Provinsi */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                PROVINSI
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => handleProvinceFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Provinsi ({provinces.length})</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* Filter 2: Kabupaten */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                KABUPATEN / KOTA
              </label>
              <select
                value={selectedKabupaten}
                onChange={(e) => handleKabupatenFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Kabupaten / Kota</option>
                {availableKabupatens.map((kab) => (
                  <option key={kab} value={kab}>{kab}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: Kecamatan */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                KECAMATAN
              </label>
              <select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Kecamatan</option>
                {availableKecamatans.map((kec) => (
                  <option key={kec} value={kec}>Kec. {kec}</option>
                ))}
              </select>
            </div>

            {/* Filter 4: Status Ketahanan */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                STATUS KETAHANAN
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="hijau">Baik (&ge;70)</option>
                <option value="kuning">Sedang (40-69)</option>
                <option value="merah">Rendah (&lt;40)</option>
              </select>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: PETA SPASIAL */}
      {activeTab === "peta" && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Sebaran Geografis Desa Terpantau</h3>
                <p className="text-xs text-slate-500 mt-0.5">Menampilkan {filteredVillages.length} desa berdasarkan filter wilayah administratif aktif.</p>
              </div>
            </div>

            <VillageMap
              villages={filteredVillages}
              onSelectVillage={(v) => setSelectedVillage(v)}
              height="580px"
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
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span>{v.kabupaten}</span>
                            <span>•</span>
                            <span>Kec. {v.kecamatan}</span>
                          </div>
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
                      <div>
                        <span className="text-xs font-semibold text-slate-500 block">Skor Ketahanan:</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">{v.provinsi}</span>
                      </div>
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
                              <p className="text-[9px] text-slate-400 truncate text-center font-medium">
                                {cat.label.slice(0, 3)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold group-hover:text-emerald-800">
                    <span>Lihat Rincian Data Lengkap</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredVillages.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-slate-700">Tidak ada data desa yang cocok dengan kriteria filter.</p>
              <p className="text-xs text-slate-400">Silakan ubah pilihan provinsi, kabupaten, atau kata kunci pencarian Anda.</p>
              <button
                onClick={() => {
                  setSelectedProvince("all");
                  setSelectedKabupaten("all");
                  setSelectedKecamatan("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUARA WARGA */}
      {activeTab === "suara" && (
        <div className="space-y-6">
          {/* Suara Warga Filters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase">Kategori:</span>
                <select
                  value={selectedReportCat}
                  onChange={(e) => setSelectedReportCat(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Kategori Pilar</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl">
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
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Menampilkan {filteredReports.length} laporan aspirasi masyarakat
            </p>
          </div>

          {/* List Aspirasi Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report) => {
              const cat = CATEGORIES.find((c) => c.id === report.catId);
              const statusBadge =
                report.status === "ditindaklanjuti"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : report.status === "ditinjau"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 border border-white/10">
                    {selectedVillage.provinsi}
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 border border-white/10">
                    {selectedVillage.kabupaten}
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 border border-white/10">
                    Kec. {selectedVillage.kecamatan}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
                  {selectedVillage.name}
                </h2>
                <p className="text-xs text-emerald-200/90 mt-1">
                  Detail capaian 8 pilar ketahanan desa yang telah diverifikasi resmi oleh Administrator Pemerintah Kabupaten.
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
                        <p className="text-[11px] text-slate-500 leading-tight">{cat.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Data ini sinkron dengan sistem evaluasi pembangunan daerah dan diawasi oleh DPMD.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW CITIZEN REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white">Suara Warga: Salurkan Aspirasi</h3>
                <p className="text-xs text-emerald-200 mt-0.5">Sampaikan kebutuhan atau aduan pembangunan di desa Anda.</p>
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
                      {v.name} ({v.kabupaten}, Kec. {v.kecamatan})
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
                  placeholder="Contoh: Perbaikan Saluran Irigasi Sawah Dusun 2"
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
                  placeholder="Contoh: Dusun 2 RT 03 / RW 01"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rincian Deskripsi Kebutuhan *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Jelaskan kondisi riil permasalahan dan dampaknya bagi warga sekitar..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Identitas Pelapor
                </label>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anon"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="anon" className="text-xs text-slate-600">
                    Kirim sebagai Warga Anonim (Rahasiakan Nama)
                  </label>
                </div>

                {!isAnonymous && (
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Nama lengkap / perwakilan warga"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Aspirasi Sekarang
                </button>
              </div>

              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Aspirasi Anda berhasil dikirim ke portal publik & dashboard desa!
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
