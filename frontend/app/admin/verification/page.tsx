"use client";

import { useState, useEffect, useMemo } from "react";
import { CATEGORIES, VILLAGES } from "@/lib/data/sdgsData";
import { api } from "@/lib/api";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  X, 
  Check, 
  AlertTriangle, 
  Send
} from "lucide-react";

interface VerificationItem {
  id: string;
  village: string;
  field: string;
  catId: number;
  value: string;
  submittedBy: string;
  submittedAt: string;
  status?: "pending" | "verified" | "rejected";
  reviewNote?: string;
}

interface VerificationItem {
  id: string;
  backendId?: number;
  village: string;
  field: string;
  catId: number;
  value: string;
  submittedBy: string;
  submittedAt: string;
  status?: "pending" | "verified" | "rejected";
  reviewNote?: string;
}

export default function VerificationPage() {
  const [data, setData] = useState<VerificationItem[]>([]);
  const [history, setHistory] = useState<VerificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");
  const [selectedVillage, setSelectedVillage] = useState<string>("all");
  const [selectedCat, setSelectedCat] = useState<string>("all");

  // Reject / Note Modal
  const [rejectModalItem, setRejectModalItem] = useState<VerificationItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Quick Approve Modal / Confirmation
  const [verifySuccessMsg, setVerifySuccessMsg] = useState<string | null>(null);

  // Fetch all indicator submissions from backend
  const fetchAllSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await api.indicators.getValues();
      if (Array.isArray(res) && res.length > 0) {
        const pendingList: VerificationItem[] = [];
        const historyList: VerificationItem[] = [];

        res.forEach((r: {
          id: number;
          indicator_name?: string;
          nilai: number;
          unit?: string;
          kategori?: string;
          catatan?: string;
          status: "pending" | "verified" | "rejected";
          submitted_name?: string;
          created_at: string;
          village_name?: string;
        }) => {
          let catId = 1;
          if (r.kategori === "kesehatan") catId = 1;
          else if (r.kategori === "pendidikan") catId = 2;
          else if (r.kategori === "ekonomi") catId = 3;
          else if (r.kategori === "infrastruktur_aksesibilitas") catId = 4;
          else if (r.kategori === "lingkungan") catId = 5;
          else if (r.kategori === "ketahanan_bencana") catId = 6;
          else if (r.kategori === "tata_kelola") catId = 7;
          else if (r.kategori === "sosial") catId = 8;

          const item: VerificationItem = {
            id: `ind-val-${r.id}`,
            backendId: r.id,
            village: r.village_name || "Desa Sukamaju",
            field: r.indicator_name || `Indikator #${r.id}`,
            catId: catId,
            value: `${r.nilai} ${r.unit || ""}`.trim(),
            submittedBy: r.submitted_name || "Operator Desa",
            submittedAt: new Date(r.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric"
            }),
            status: r.status,
            reviewNote: r.catatan || undefined,
          };

          if (r.status === "pending") {
            pendingList.push(item);
          } else {
            historyList.push(item);
          }
        });

        setData(pendingList);
        setHistory(historyList);
      } else {
        setData([]);
      }
    } catch (err) {
      console.warn("API request failed", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSubmissions();
  }, []);

  // Extract unique kecamatans
  const kecamatans = useMemo(() => {
    return Array.from(new Set(VILLAGES.map((v) => v.kecamatan)));
  }, []);

  // Filtered Pending Data
  const filteredPending = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      const matchSearch = !q ||
                          (item.village && item.village.toLowerCase().includes(q)) ||
                          (item.field && item.field.toLowerCase().includes(q));
      const itemKec = VILLAGES.find((v) => v.name === item.village)?.kecamatan;
      const matchKec = selectedKecamatan === "all" || itemKec === selectedKecamatan;
      const matchVillage = selectedVillage === "all" || item.village === selectedVillage;
      const matchCat = selectedCat === "all" || item.catId === Number(selectedCat);
      return matchSearch && matchKec && matchVillage && matchCat;
    });
  }, [data, searchQuery, selectedKecamatan, selectedVillage, selectedCat]);

  // Filtered History Data
  const filteredHistory = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return history.filter((item) => {
      const matchSearch = !q ||
                          (item.village && item.village.toLowerCase().includes(q)) ||
                          (item.field && item.field.toLowerCase().includes(q));
      const itemKec = VILLAGES.find((v) => v.name === item.village)?.kecamatan;
      const matchKec = selectedKecamatan === "all" || itemKec === selectedKecamatan;
      const matchVillage = selectedVillage === "all" || item.village === selectedVillage;
      const matchCat = selectedCat === "all" || item.catId === Number(selectedCat);
      return matchSearch && matchKec && matchVillage && matchCat;
    });
  }, [history, searchQuery, selectedKecamatan, selectedVillage, selectedCat]);

  // Actions
  const handleApprove = async (item: VerificationItem) => {
    const updatedItem = {
      ...item,
      status: "verified" as const,
      reviewNote: "Diverifikasi.",
    };
    setData((prev) => prev.filter((i) => i.id !== item.id));
    setHistory((prev) => [updatedItem, ...prev]);

    // Send status update to FastAPI backend
    try {
      const targetId = item.backendId || parseInt(item.id.replace(/\D/g, ""), 10) || 1;
      await api.indicators.verifyValue(targetId, {
        status: "verified",
        catatan: "Disetujui",
      });
    } catch (err) {
      console.warn("Backend verify sync failed", err);
    }

    setVerifySuccessMsg(`"${item.field}" dari ${item.village} berhasil diverifikasi.`);
    setTimeout(() => setVerifySuccessMsg(null), 3500);
  };

  const handleOpenRejectModal = (item: VerificationItem) => {
    setRejectModalItem(item);
    setRejectReason("");
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;

    const updatedItem = {
      ...rejectModalItem,
      status: "rejected" as const,
      reviewNote: rejectReason,
    };

    setData((prev) => prev.filter((i) => i.id !== rejectModalItem.id));
    setHistory((prev) => [updatedItem, ...prev]);

    // Send rejection to FastAPI backend
    try {
      const targetId = rejectModalItem.backendId || parseInt(rejectModalItem.id.replace(/\D/g, ""), 10) || 1;
      await api.indicators.verifyValue(targetId, {
        status: "rejected",
        catatan: rejectReason,
      });
    } catch (err) {
      console.warn("Backend reject sync failed", err);
    }

    setRejectModalItem(null);
    setRejectReason("");
    setVerifySuccessMsg(`"${rejectModalItem.field}" dikembalikan untuk revisi.`);
    setTimeout(() => setVerifySuccessMsg(null), 3500);
  };


  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Verifikasi Data
              </h1>
            </div>
          </div>
        </div>

      </div>

      {/* Success Notification Alert */}
      {verifySuccessMsg && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{verifySuccessMsg}</span>
          </div>
          <button onClick={() => setVerifySuccessMsg(null)} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "pending"
              ? "bg-white text-emerald-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Antrean ({data.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "history"
              ? "bg-white text-emerald-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Riwayat ({history.length})</span>
        </button>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari desa atau indikator..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs w-full sm:w-auto">
              <span className="font-semibold text-slate-400 uppercase">Kecamatan:</span>
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

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs w-full sm:w-auto">
              <span className="font-semibold text-slate-400 uppercase">Desa:</span>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Desa</option>
                {VILLAGES.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} (Kec. {v.kecamatan})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs w-full sm:w-auto">
              <span className="font-semibold text-slate-400 uppercase">Pilar:</span>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
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
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 px-6">Desa</th>
                <th className="p-4">Indikator</th>
                <th className="p-4">Nilai Baru</th>
                <th className="p-4">Pengaju</th>
                <th className="p-4">Waktu</th>
                {activeTab === "history" && <th className="p-4">Status & Catatan</th>}
                <th className="p-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {/* TAB 1: PENDING */}
              {activeTab === "pending" &&
                filteredPending.map((item) => {
                  const cat = CATEGORIES.find((c) => c.id === item.catId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 px-6">
                        <div className="font-extrabold text-slate-900">{item.village}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{item.field}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{cat?.label}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                          {item.value}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-slate-700 font-medium">{item.submittedBy}</div>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {item.submittedAt}
                        </div>
                      </td>
                      <td className="p-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenRejectModal(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                            title="Revisi"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Revisi</span>
                          </button>
                          <button
                            onClick={() => handleApprove(item)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-xs shadow-md shadow-emerald-200"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Setuju</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {/* TAB 2: HISTORY */}
              {activeTab === "history" &&
                filteredHistory.map((item) => {
                  const cat = CATEGORIES.find((c) => c.id === item.catId);
                  const isVerified = item.status === "verified";
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 px-6">
                        <div className="font-extrabold text-slate-900">{item.village}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{item.field}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{cat?.label}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-black text-xs border border-slate-200">
                          {item.value}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-slate-700 font-medium">{item.submittedBy}</div>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {item.submittedAt}
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {isVerified ? "Disetujui" : "Perlu Revisi"}
                        </span>
                        {item.reviewNote && (
                          <p className="text-[11px] text-slate-500 mt-1 truncate" title={item.reviewNote}>
                            {item.reviewNote}
                          </p>
                        )}
                      </td>
                      <td className="p-4 px-6 text-right text-xs text-slate-400 font-medium">
                        Selesai
                      </td>
                    </tr>
                  );
                })}

              {/* Empty state pending */}
              {activeTab === "pending" && filteredPending.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto" />
                    <p className="text-base font-bold text-slate-800">Semua Data Terverifikasi</p>
                    <p className="text-xs text-slate-400">Tidak ada pengajuan yang menunggu.</p>
                  </td>
                </tr>
              )}

              {/* Empty state history */}
              {activeTab === "history" && filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 space-y-3">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-base font-bold text-slate-800">Belum Ada Riwayat</p>
                    <p className="text-xs text-slate-400">Aktivitas verifikasi akan tercatat di sini.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECT / REVISION NOTE MODAL */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-gradient-to-r from-rose-800 to-slate-900 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-300" />
                  <h3 className="text-lg font-bold text-white">Minta Revisi</h3>
                </div>
              </div>

              <button
                onClick={() => setRejectModalItem(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Desa: <strong>{rejectModalItem.village}</strong></span>
                  <span>Nilai: <strong>{rejectModalItem.value}</strong></span>
                </div>
                <p className="font-bold text-slate-800 text-sm">{rejectModalItem.field}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catatan Revisi *
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Tuliskan alasan penolakan atau instruksi revisi..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
