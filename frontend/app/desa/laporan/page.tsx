"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { 
  CITIZEN_REPORTS, 
  CATEGORIES, 
  VILLAGES, 
  type CitizenReport 
} from "@/lib/data/sdgsData";
import { api } from "@/lib/api";
import { 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ThumbsUp, 
  Calendar, 
  Send, 
  X,
  RefreshCw
} from "lucide-react";

export default function DesaLaporanPage() {
  const { user } = useAuth();

  // Find the single locked village for the authenticated village staff
  const currentVillage = useMemo(() => {
    return VILLAGES.find((v) => v.id === user?.villageId || v.name === user?.village) || VILLAGES[0];
  }, [user]);

  const [reports, setReports] = useState<CitizenReport[]>(CITIZEN_REPORTS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Response Modal
  const [activeReport, setActiveReport] = useState<CitizenReport | null>(null);
  const [responseText, setResponseText] = useState("");
  const [targetStatus, setTargetStatus] = useState<CitizenReport["status"]>("ditinjau");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch reports from backend
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const vId = currentVillage.id ? parseInt(currentVillage.id.replace(/\D/g, ""), 10) || 1 : 1;
      const res = await api.reports.getAll({ village_id: vId });
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
          const categoryObj = CATEGORIES.find(c => c.id === (r.cat_id || 1));

          return {
            id: `rep-${r.id}`,
            backendId: r.id,
            village: r.village_name || currentVillage.name,
            villageName: r.village_name || currentVillage.name,
            villageId: currentVillage.id,
            kecamatan: r.kecamatan || currentVillage.kecamatan,
            catId: r.cat_id || 1,
            category: categoryObj?.label.toLowerCase() || "infrastruktur",
            title: r.title || "Aspirasi Warga",
            description: r.description || "",
            location: r.location || currentVillage.name,
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
      } else {
        setReports(CITIZEN_REPORTS.filter(r => r.villageId === currentVillage.id));
      }
    } catch (err) {
      console.warn("Using fallback reports", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentVillage]);

  // Reports belonging exclusively to this village
  const villageReports = useMemo(() => {
    return reports.filter((r) => !r.villageId || r.villageId === currentVillage.id || (r.village && r.village.toLowerCase() === currentVillage.name.toLowerCase()));
  }, [reports, currentVillage]);

  const filteredReports = useMemo(() => {
    if (selectedStatus === "all") return villageReports;
    return villageReports.filter((r) => r.status === selectedStatus);
  }, [villageReports, selectedStatus]);

  // Statistics
  const pendingCount = villageReports.filter((r) => r.status === "terkirim").length;
  const inReviewCount = villageReports.filter((r) => r.status === "ditinjau").length;
  const resolvedCount = villageReports.filter((r) => r.status === "ditindaklanjuti").length;

  const handleOpenModal = (report: CitizenReport) => {
    setActiveReport(report);
    setResponseText(report.adminResponse || "");
    setTargetStatus(report.status);
  };

  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport) return;

    setIsSaving(true);
    const updatedResponse = responseText.trim() ? `[Pemerintah Desa]: ${responseText.trim()}` : undefined;

    try {
      if (activeReport.backendId) {
        await api.reports.respond(activeReport.backendId, {
          response_note: updatedResponse || "",
          status: targetStatus
        });
      }
    } catch (err) {
      console.warn("Failed to persist report response", err);
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageCircle className="w-3.5 h-3.5" />
            Aspirasi & Suara Warga (KF-13)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inbox Suara Warga Desa
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Dengar langsung aspirasi dan laporan ketidaksesuaian data lapangan dari masyarakat {currentVillage.name}.
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

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Menunggu Tanggapan</p>
            <p className="text-3xl font-black text-rose-600 mt-2">{pendingCount}</p>
            <p className="text-xs text-slate-500 mt-1">Aspirasi warga baru</p>
          </div>
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Sedang Ditindaklanjuti</p>
            <p className="text-3xl font-black text-amber-600 mt-2">{inReviewCount}</p>
            <p className="text-xs text-slate-500 mt-1">Verifikasi & perbaikan fisik</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Tuntas Diselesaikan</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{resolvedCount}</p>
            <p className="text-xs text-slate-500 mt-1">Data selaras dengan warga</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Filter Status Aspirasi:
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === "all"
                ? "bg-emerald-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Semua ({villageReports.length})
          </button>
          <button
            onClick={() => setSelectedStatus("terkirim")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === "terkirim"
                ? "bg-emerald-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Menunggu ({pendingCount})
          </button>
          <button
            onClick={() => setSelectedStatus("ditinjau")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === "ditinjau"
                ? "bg-emerald-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Ditinjau ({inReviewCount})
          </button>
          <button
            onClick={() => setSelectedStatus("ditindaklanjuti")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === "ditindaklanjuti"
                ? "bg-emerald-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Selesai ({resolvedCount})
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((item) => {
          const categoryObj = CATEGORIES.find((c) => c.id === item.catId || c.id.toString() === item.category);
          const responseText = item.adminResponse || item.responseNote;
          const displayDate = item.createdAt || item.submittedAt;

          return (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-200 transition-all"
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
                    Pilar {categoryObj?.label || item.category || "Umum"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {displayDate}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    {item.upvotes} Dukungan Warga
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  &ldquo;{item.description}&rdquo;
                </p>
              </div>

              {/* Official response note */}
              {responseText && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Tanggapan Resmi yang Ditampilkan ke Publik:</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed pl-5.5">
                    {responseText}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {responseText ? "Edit Klarifikasi Desa" : "Beri Klarifikasi / Tindak Lanjut"}
                </button>
              </div>
            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">Tidak Ada Aduan Menunggu</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Saat ini tidak ada laporan ketidaksesuaian data yang aktif untuk wilayah {currentVillage.name}.
            </p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {activeReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Klarifikasi Pemerintah Desa
                </span>
                <h3 className="font-extrabold text-lg text-white mt-0.5">{activeReport.title}</h3>
                <p className="text-xs text-emerald-200">
                  {currentVillage.name} &bull; Transparansi Publik
                </p>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Status Penanganan:
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as CitizenReport["status"])}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ditinjau">Sedang Ditinjau & Dicek Lapangan</option>
                  <option value="ditindaklanjuti">Selesai Ditindaklanjuti / Diselaraskan</option>
                  <option value="terkirim">Menunggu Tindak Lanjut</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Tanggapan / Klarifikasi dari Pemerintah Desa:
                </label>
                <textarea
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Contoh: Terima kasih atas laporannya. Pihak desa telah melakukan musyawarah dan alokasi perbaikan sarana sanitasi telah dianggarkan pada APBDes tahap 2..."
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
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all"
                >
                  Simpan & Publikasikan ke Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
