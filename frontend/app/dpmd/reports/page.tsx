"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  CITIZEN_REPORTS, 
  CATEGORIES, 
  VILLAGES, 
  type CitizenReport 
} from "@/lib/data/sdgsData";
import { api } from "@/lib/api";
import { 
  MessageCircle, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ThumbsUp, 
  MapPin, 
  Send, 
  ShieldCheck,
  Building2,
  Calendar,
  X,
  RefreshCw
} from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<CitizenReport[]>(CITIZEN_REPORTS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal for responding to a report
  const [activeReport, setActiveReport] = useState<CitizenReport | null>(null);
  const [responseText, setResponseText] = useState("");
  const [targetStatus, setTargetStatus] = useState<CitizenReport["status"]>("ditinjau");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch reports from backend
  const fetchAllReports = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  // Extract unique kecamatans
  const kecamatans = useMemo(() => {
    return Array.from(new Set(VILLAGES.map((v) => v.kecamatan)));
  }, []);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchKec = selectedKecamatan === "all" || r.kecamatan === selectedKecamatan;
      const matchCat =
        selectedCategory === "all" ||
        r.catId?.toString() === selectedCategory ||
        r.category === selectedCategory;
      const matchStatus = selectedStatus === "all" || r.status === selectedStatus;
      const vName = r.villageName || r.village || "";
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (vName && vName.toLowerCase().includes(q));
      return matchKec && matchCat && matchStatus && matchSearch;
    });
  }, [reports, selectedKecamatan, selectedCategory, selectedStatus, searchQuery]);

  // Statistics
  const pendingCount = reports.filter((r) => r.status === "terkirim").length;
  const inReviewCount = reports.filter((r) => r.status === "ditinjau").length;
  const resolvedCount = reports.filter((r) => r.status === "ditindaklanjuti").length;

  const handleOpenModal = (report: CitizenReport) => {
    setActiveReport(report);
    setResponseText(report.adminResponse || "");
    setTargetStatus(report.status);
  };

  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport) return;

    setIsSaving(true);
    const updatedResponse = responseText.trim() ? `[DPMD Kabupaten]: ${responseText.trim()}` : undefined;

    try {
      if (activeReport.backendId) {
        await api.reports.respond(activeReport.backendId, {
          response_note: updatedResponse || "",
          status: targetStatus
        });
      }
    } catch (err) {
      console.warn("Failed to persist admin report response", err);
    } finally {
      setIsSaving(false);
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === activeReport.id
          ? {
              ...r,
              status: targetStatus,
              adminResponse: updatedResponse,
            }
          : r
      )
    );

    setActiveReport(null);
    setResponseText("");
  };


  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Tingkat Kabupaten (KF-13)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Suara Warga & Aduan Data
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitoring, verifikasi lapangan, dan tindak lanjut laporan ketidaksesuaian data SDGs Desa dari masyarakat.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Menunggu Tindak Lanjut</p>
            <p className="text-3xl font-black text-rose-600 mt-2">{pendingCount}</p>
            <p className="text-xs text-slate-500 mt-1">Laporan baru dari warga</p>
          </div>
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Sedang Ditinjau Lapangan</p>
            <p className="text-3xl font-black text-amber-600 mt-2">{inReviewCount}</p>
            <p className="text-xs text-slate-500 mt-1">Proses klarifikasi desa</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Selesai Ditindaklanjuti</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{resolvedCount}</p>
            <p className="text-xs text-slate-500 mt-1">Data & solusi diselaraskan</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci laporan atau nama desa..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter Kecamatan */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-400 uppercase text-[10px]">Kecamatan:</span>
              <select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Kecamatan</option>
                {kecamatans.map((kec) => (
                  <option key={kec} value={kec}>
                    Kec. {kec}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Kategori Pilar */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Pilar</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Filter Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="terkirim">Menunggu Tindak Lanjut</option>
              <option value="ditinjau">Sedang Ditinjau</option>
              <option value="ditindaklanjuti">Selesai Ditindaklanjuti</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table / List */}
      <div className="space-y-4">
        {filteredReports.map((item) => {
          const categoryObj = CATEGORIES.find((c) => c.id === item.catId || c.id.toString() === item.category);

          return (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      item.status === "ditindaklanjuti"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "ditinjau"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {item.status === "ditindaklanjuti"
                      ? "Selesai Ditindaklanjuti"
                      : item.status === "ditinjau"
                      ? "Sedang Ditinjau"
                      : "Menunggu Tindak Lanjut"}
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {categoryObj?.label || item.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.createdAt}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    {item.upvotes} Dukungan
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.villageName}</span>
                  <span>&bull;</span>
                  <span>Kecamatan {item.kecamatan}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  &ldquo;{item.description}&rdquo;
                </p>
              </div>

              {/* Official response if present */}
              {item.adminResponse && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Catatan Tindak Lanjut Administrator:</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed pl-5.5">
                    {item.adminResponse}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {item.adminResponse ? "Perbarui Tanggapan & Status" : "Beri Tanggapan & Tindak Lanjut"}
                </button>
              </div>
            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">Tidak Ada Laporan Ditemukan</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada aduan warga yang cocok dengan filter atau kata kunci pencarian Anda.
            </p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {activeReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Tindak Lanjut Laporan Warga
                </span>
                <h3 className="font-extrabold text-lg text-white mt-0.5">{activeReport.title}</h3>
                <p className="text-xs text-slate-300">
                  {activeReport.villageName} &bull; Kec. {activeReport.kecamatan}
                </p>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Update Status Penanganan:
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as CitizenReport["status"])}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="terkirim">Menunggu Tindak Lanjut</option>
                  <option value="ditinjau">Sedang Ditinjau Lapangan</option>
                  <option value="ditindaklanjuti">Selesai Ditindaklanjuti & Diselaraskan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Catatan Tindak Lanjut Resmi (Publik):
                </label>
                <textarea
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Tuliskan keterangan verifikasi lapangan atau instruksi koreksi data kepada perangkat desa..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all"
                >
                  Simpan & Publikasikan Tanggapan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
