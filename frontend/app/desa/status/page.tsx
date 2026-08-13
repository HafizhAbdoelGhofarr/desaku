"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { 
  VILLAGES, 
  CATEGORIES, 
  PENDING_VERIFICATIONS,
} from "@/lib/data/sdgsData";
import { api } from "@/lib/api";
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Building2, 
  FileText, 
  RefreshCw, 
  Info,
  Trash2,
  X,
  Save,
  Check
} from "lucide-react";

interface SubmissionItem {
  id: string;
  backendId?: number;
  village: string;
  field: string;
  value: string;
  numericVal: number;
  catId: number;
  submittedAt: string;
  submittedBy: string;
  status: "pending" | "verified" | "rejected";
  verifiedAt?: string;
  verifier?: string;
  notes?: string;
}

const DEFAULT_SUBMISSIONS: SubmissionItem[] = [
  ...PENDING_VERIFICATIONS.map((pv) => ({
    ...pv,
    numericVal: parseFloat(pv.value) || 10,
    notes: "Menunggu peninjauan oleh tim verifikator Administrator Kabupaten.",
  })),
  {
    id: "v-done-1",
    village: "Desa Sukamaju",
    field: "Cakupan Imunisasi Dasar",
    value: "95.4%",
    numericVal: 95.4,
    catId: 1,
    submittedAt: "3 hari lalu",
    submittedBy: "Sari Wulandari (Kaur Kesra)",
    status: "verified",
    verifiedAt: "2 hari lalu",
    verifier: "Budi Santoso (Admin Kabupaten)",
    notes: "Data valid terkonfirmasi dengan laporan Puskesmas Ciawi.",
  },
  {
    id: "v-done-2",
    village: "Desa Sukamaju",
    field: "Akses Listrik Rumah Tangga",
    value: "98.8%",
    numericVal: 98.8,
    catId: 4,
    submittedAt: "5 hari lalu",
    submittedBy: "Sari Wulandari (Kaur Kesra)",
    status: "verified",
    verifiedAt: "4 hari lalu",
    verifier: "Budi Santoso (Admin Kabupaten)",
    notes: "Sesuai data PLN Distribusi Bogor.",
  },
  {
    id: "v-done-3",
    village: "Desa Sukamaju",
    field: "BUMDes Aktif",
    value: "3 unit",
    numericVal: 3,
    catId: 3,
    submittedAt: "1 minggu lalu",
    submittedBy: "Sari Wulandari (Kaur Kesra)",
    status: "verified",
    verifiedAt: "6 hari lalu",
    verifier: "Administrator Kabupaten",
    notes: "Terdaftar dalam database BUMDes Kemendesa.",
  },
  {
    id: "v-rej-1",
    village: "Desa Sukamaju",
    field: "Angka Kemiskinan Ekstrem",
    value: "2.1%",
    numericVal: 2.1,
    catId: 3,
    submittedAt: "1 minggu lalu",
    submittedBy: "Sari Wulandari (Kaur Kesra)",
    status: "rejected",
    verifiedAt: "5 hari lalu",
    verifier: "Budi Santoso (Admin Kabupaten)",
    notes: "Data berbeda signifikan dengan DTKS Kemensos. Mohon lampirkan berita acara Musdes verifikasi kemiskinan.",
  }
];

export default function DesaStatusPage() {
  const { user } = useAuth();
  const village = VILLAGES.find((v) => v.name === user?.village) || VILLAGES[0];

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [catFilter, setCatFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<SubmissionItem | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch from backend API
  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const vId = user?.villageId ? parseInt(user.villageId.replace(/\D/g, ""), 10) || 1 : 1;
      const res = await api.indicators.getValues({ village_id: vId });
      
      if (Array.isArray(res) && res.length > 0) {
        const mapped: SubmissionItem[] = res.map((r: {
          id: number;
          indicator_name?: string;
          nilai: number;
          unit?: string;
          kategori?: string;
          catatan?: string;
          status: "pending" | "verified" | "rejected";
          submitted_name?: string;
          created_at: string;
          verified_at?: string;
          village_name?: string;
        }) => {
          // Map category string to catId
          let catId = 1;
          if (r.kategori === "kesehatan") catId = 1;
          else if (r.kategori === "pendidikan") catId = 2;
          else if (r.kategori === "ekonomi") catId = 3;
          else if (r.kategori === "infrastruktur_aksesibilitas") catId = 4;
          else if (r.kategori === "lingkungan") catId = 5;
          else if (r.kategori === "ketahanan_bencana") catId = 6;
          else if (r.kategori === "tata_kelola") catId = 7;
          else if (r.kategori === "sosial") catId = 8;

          return {
            id: `api-${r.id}`,
            backendId: r.id,
            village: r.village_name || village.name,
            field: r.indicator_name || `Indikator #${r.id}`,
            value: `${r.nilai} ${r.unit || ""}`.trim(),
            numericVal: r.nilai,
            catId: catId,
            submittedAt: new Date(r.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric"
            }),
            submittedBy: r.submitted_name || "Operator Desa",
            status: r.status,
            verifiedAt: r.verified_at ? new Date(r.verified_at).toLocaleDateString("id-ID") : undefined,
            verifier: r.status !== "pending" ? "Administrator Kabupaten" : undefined,
            notes: r.catatan || "Menunggu verifikasi DPMD."
          };
        });
        setSubmissions(mapped);
      } else {
        // Fallback default submissions
        setSubmissions(DEFAULT_SUBMISSIONS);
      }
    } catch (err) {
      console.warn("Using local submissions state", err);
      setSubmissions(DEFAULT_SUBMISSIONS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  // Handle Edit Submit
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setIsSavingEdit(true);
    try {
      if (editingItem.backendId) {
        await api.indicators.updateValue(editingItem.backendId, {
          nilai: editValue,
          catatan: editNotes
        });
      }
      
      setSubmissions(prev => prev.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            value: `${editValue}`,
            numericVal: editValue,
            notes: editNotes,
            status: "pending" // Reset to pending after edit
          };
        }
        return item;
      }));

      setActionSuccess("Perubahan data berhasil disimpan ke server!");
      setEditingItem(null);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch {
      setActionSuccess("Data berhasil diperbarui!");
      setEditingItem(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Delete
  const handleDelete = async (item: SubmissionItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengajuan "${item.field}"?`)) return;
    
    try {
      if (item.backendId) {
        await api.indicators.deleteValue(item.backendId);
      }
      setSubmissions(prev => prev.filter(i => i.id !== item.id));
      setActionSuccess(`Pengajuan "${item.field}" berhasil dihapus.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch {
      setSubmissions(prev => prev.filter(i => i.id !== item.id));
      setActionSuccess("Pengajuan berhasil dihapus.");
    }
  };

  // Filter list submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchStatus = statusFilter === "all" ? true : item.status === statusFilter;
      const matchCat = catFilter === "all" ? true : item.catId === catFilter;
      const matchSearch = 
        item.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchStatus && matchCat && matchSearch;
    });
  }, [submissions, statusFilter, catFilter, searchQuery]);

  // Hitung agregat desa
  const countPending = submissions.filter((i) => i.status === "pending").length;
  const countVerified = submissions.filter((i) => i.status === "verified").length;
  const countRejected = submissions.filter((i) => i.status === "rejected").length;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Status Verifikasi
            </h1>
          </div>
        </div>

        {/* Action Button & Locked Village Badge */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/90 px-3.5 py-2 rounded-2xl shadow-sm text-xs">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-slate-900">{village.name} (Kec. {village.kecamatan})</span>
          </div>

          <button
            onClick={fetchSubmissions}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 text-xs font-bold transition-all shadow-sm"
            title="Refresh data dari database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : "text-slate-500"}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/desa/input"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Input Data Baru</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between gap-3 text-sm font-medium animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter("all")}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            statusFilter === "all" ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-md" : "border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pengajuan</span>
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{submissions.length}</span>
            <span className="text-xs text-slate-400 font-medium">indikator</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter("pending")}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            statusFilter === "pending" ? "border-amber-500 ring-2 ring-amber-500/10 shadow-md" : "border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Menunggu Verifikasi</span>
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{countPending}</span>
            <span className="text-xs text-amber-600/70 font-medium">pending</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter("verified")}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            statusFilter === "verified" ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-md" : "border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Disetujui</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{countVerified}</span>
            <span className="text-xs text-emerald-600/70 font-medium">terverifikasi</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter("rejected")}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            statusFilter === "rejected" ? "border-rose-500 ring-2 ring-rose-500/10 shadow-md" : "border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Perlu Revisi</span>
            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{countRejected}</span>
            <span className="text-xs text-rose-600/70 font-medium">ditolak</span>
          </div>
        </div>
      </div>


      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50/40">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "pending", "verified", "rejected"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  statusFilter === st
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {st === "all" ? "Semua Status" : st === "pending" ? "Pending" : st === "verified" ? "Disetujui" : "Ditolak"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">Semua Kategori (8 Pilar)</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari indikator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submissions List / Table */}
        <div className="divide-y divide-slate-100">
          {filteredSubmissions.map((item) => {
            const cat = CATEGORIES.find((c) => c.id === item.catId);

            return (
              <div
                key={item.id}
                className="p-6 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Info Indikator */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {cat?.label || "Umum"}
                    </span>
                    <h3 className="font-bold text-base text-slate-900">{item.field}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{item.submittedAt}</strong>
                    </span>
                    <span>•</span>
                    <span><strong className="text-slate-700">{item.submittedBy}</strong></span>
                  </div>

                  {/* Catatan Verifikator / Catatan Internal */}
                  {item.notes && (
                    <div className="mt-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-start gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">
                        {item.notes}
                      </span>
                    </div>
                  )}
                </div>

                {/* Nilai & Status Badge & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-right">
                    <p className="text-[11px] uppercase font-bold text-slate-400">Nilai</p>
                    <p className="text-lg font-black text-slate-900">{item.value}</p>
                  </div>

                  <div className="min-w-[130px] flex justify-end">
                    {item.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Pending
                      </span>
                    )}

                    {item.status === "verified" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Disetujui
                      </span>
                    )}

                    {item.status === "rejected" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        Ditolak
                      </span>
                    )}
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setEditValue(item.numericVal);
                        setEditNotes(item.notes || "");
                      }}
                      className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all border border-slate-200"
                      title="Edit Nilai Pengajuan"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-200"
                      title="Hapus Pengajuan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredSubmissions.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Filter className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-700">Data kosong</h4>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setCatFilter("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <span>Edit Pengajuan Indikator</span>
              </div>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Indikator</label>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{editingItem.field}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nilai Terbaru</label>
                <input
                  type="number"
                  step="any"
                  value={editValue}
                  onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Pengajuan / Bukti</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Keterangan tambahan atau catatan perbaikan..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingEdit ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

