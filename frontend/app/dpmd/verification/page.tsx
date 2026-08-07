"use client";

import { useState, useMemo } from "react";
import { PENDING_VERIFICATIONS, CATEGORIES, VILLAGES } from "@/lib/data/sdgsData";
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

export default function VerificationPage() {
  const [data, setData] = useState<VerificationItem[]>(
    PENDING_VERIFICATIONS.map((item) => ({ ...item, status: "pending" as const }))
  );
  const [history, setHistory] = useState<VerificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillage, setSelectedVillage] = useState<string>("all");
  const [selectedCat, setSelectedCat] = useState<string>("all");

  // Reject / Note Modal
  const [rejectModalItem, setRejectModalItem] = useState<VerificationItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Quick Approve Modal / Confirmation
  const [verifySuccessMsg, setVerifySuccessMsg] = useState<string | null>(null);

  // Filtered Pending Data
  const filteredPending = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.field.toLowerCase().includes(searchQuery.toLowerCase());
      const matchVillage = selectedVillage === "all" || item.village === selectedVillage;
      const matchCat = selectedCat === "all" || item.catId === Number(selectedCat);
      return matchSearch && matchVillage && matchCat;
    });
  }, [data, searchQuery, selectedVillage, selectedCat]);

  // Filtered History Data
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch = item.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.field.toLowerCase().includes(searchQuery.toLowerCase());
      const matchVillage = selectedVillage === "all" || item.village === selectedVillage;
      const matchCat = selectedCat === "all" || item.catId === Number(selectedCat);
      return matchSearch && matchVillage && matchCat;
    });
  }, [history, searchQuery, selectedVillage, selectedCat]);

  // Actions
  const handleApprove = (item: VerificationItem) => {
    const updatedItem = {
      ...item,
      status: "verified" as const,
      reviewNote: "Data telah diverifikasi dan sesuai dengan dokumen pembuktian lapangan.",
    };
    setData((prev) => prev.filter((i) => i.id !== item.id));
    setHistory((prev) => [updatedItem, ...prev]);

    setVerifySuccessMsg(`Indikator "${item.field}" dari ${item.village} berhasil disetujui!`);
    setTimeout(() => setVerifySuccessMsg(null), 3000);
  };

  const handleOpenRejectModal = (item: VerificationItem) => {
    setRejectModalItem(item);
    setRejectReason("Mohon lengkapi dokumen pembuktian lapangan atau sesuaikan angka dengan SK resmi desa.");
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;

    const updatedItem = {
      ...rejectModalItem,
      status: "rejected" as const,
      reviewNote: rejectReason,
    };

    setData((prev) => prev.filter((i) => i.id !== rejectModalItem.id));
    setHistory((prev) => [updatedItem, ...prev]);

    setRejectModalItem(null);
    setRejectReason("");
    setVerifySuccessMsg(`Pengajuan "${rejectModalItem.field}" dikembalikan untuk revisi.`);
    setTimeout(() => setVerifySuccessMsg(null), 3000);
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
                Verifikasi & Validasi Data Indikator
              </h1>
              <p className="text-slate-500 mt-0.5">
                Tinjau pengajuan indikator terbaru dari pengelola desa sebelum diterbitkan ke publik.
              </p>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-amber-800 uppercase block">Menunggu</span>
            <span className="text-xl font-black text-amber-900">{data.length}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Disetujui</span>
            <span className="text-xl font-black text-emerald-900">
              {history.filter((h) => h.status === "verified").length}
            </span>
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
          <span>Antrean Verifikasi ({data.length})</span>
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
          <span>Riwayat Verifikasi ({history.length})</span>
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
              <span className="font-semibold text-slate-400 uppercase">Desa:</span>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Desa</option>
                {VILLAGES.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
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
                            title="Tolak atau Minta Revisi"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Minta Revisi</span>
                          </button>
                          <button
                            onClick={() => handleApprove(item)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-xs shadow-md shadow-emerald-200"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Setujui</span>
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
                        Tervalidasi
                      </td>
                    </tr>
                  );
                })}

              {/* Empty state pending */}
              {activeTab === "pending" && filteredPending.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto" />
                    <p className="text-base font-bold text-slate-800">Semua Data Telah Diverifikasi!</p>
                    <p className="text-xs text-slate-400">Tidak ada pengajuan indikator yang menunggu persetujuan saat ini.</p>
                  </td>
                </tr>
              )}

              {/* Empty state history */}
              {activeTab === "history" && filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 space-y-3">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-base font-bold text-slate-800">Belum Ada Riwayat Verifikasi Sesi Ini</p>
                    <p className="text-xs text-slate-400">Aktivitas verifikasi atau revisi yang Anda lakukan akan tercatat di sini.</p>
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
                  <h3 className="text-lg font-bold text-white">Minta Revisi / Tolak Pengajuan</h3>
                </div>
                <p className="text-xs text-rose-100 mt-1">
                  Kirim catatan kepada perangkat {rejectModalItem.village} agar data diperbaiki.
                </p>
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
                  Catatan Verifikator DPMD *
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
                  <span>Kirim Catatan Revisi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
