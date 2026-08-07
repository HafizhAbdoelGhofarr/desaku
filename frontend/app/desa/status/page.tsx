"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { 
  VILLAGES, 
  CATEGORIES, 
  PENDING_VERIFICATIONS,
} from "@/lib/data/sdgsData";
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
  Info 
} from "lucide-react";

// Mock history extended data for demo purposes (including verified & rejected items)
interface SubmissionItem {
  id: string;
  village: string;
  field: string;
  value: string;
  catId: number;
  submittedAt: string;
  submittedBy: string;
  status: "pending" | "verified" | "rejected";
  verifiedAt?: string;
  verifier?: string;
  notes?: string;
}

const INITIAL_SUBMISSIONS: SubmissionItem[] = [
  ...PENDING_VERIFICATIONS.map((pv) => ({
    ...pv,
    notes: "Menunggu peninjauan oleh tim verifikator DPMD Kabupaten.",
  })),
  // Contoh data verified
  {
    id: "v-done-1",
    village: "Desa Sukamaju",
    field: "Cakupan Imunisasi Dasar",
    value: "95.4%",
    catId: 1,
    submittedAt: "3 hari lalu",
    submittedBy: "Sari Wulandari (Kaur Kesra)",
    status: "verified",
    verifiedAt: "2 hari lalu",
    verifier: "Budi Santoso (DPMD)",
    notes: "Data valid terkonfirmasi dengan laporan Puskesmas Ciawi.",
  },
  {
    id: "v-done-2",
    village: "Desa Sukamaju",
    field: "Akses Listrik Rumah Tangga",
    value: "98.8%",
    catId: 4,
    submittedAt: "5 hari lalu",
    submittedBy: "Sari Wulandari (Kaur Kesra)",
    status: "verified",
    verifiedAt: "4 hari lalu",
    verifier: "Budi Santoso (DPMD)",
    notes: "Sesuai data PLN Distribusi Bogor.",
  },
  {
    id: "v-done-3",
    village: "Desa Sukamaju",
    field: "BUMDes Aktif",
    value: "3 unit",
    catId: 3,
    submittedAt: "1 minggu lalu",
    submittedBy: "Sari Wulandari (Kaur Kesra)",
    status: "verified",
    verifiedAt: "6 hari lalu",
    verifier: "Admin DPMD",
    notes: "Terdaftar dalam database BUMDes Kemendesa.",
  },
  // Contoh data rejected
  {
    id: "v-rej-1",
    village: "Desa Sukamaju",
    field: "Angka Kemiskinan Ekstrem",
    value: "2.1%",
    catId: 3,
    submittedAt: "1 minggu lalu",
    submittedBy: "Sari Wulandari (Kaur Kesra)",
    status: "rejected",
    verifiedAt: "5 hari lalu",
    verifier: "Budi Santoso (DPMD)",
    notes: "Data berbeda signifikan dengan DTKS Kemensos. Mohon lampirkan berita acara Musdes verifikasi kemiskinan.",
  },
  {
    id: "v-rej-2",
    village: "Desa Tegalwaru",
    field: "Panjang Jalan Mantap",
    value: "95%",
    catId: 4,
    submittedAt: "4 hari lalu",
    submittedBy: "Sekdes Budi S.",
    status: "rejected",
    verifiedAt: "3 hari lalu",
    verifier: "Budi Santoso (DPMD)",
    notes: "Survei Dinas PUPR mencatat hanya 62% jalan dalam kondisi mantap.",
  },
];

export default function DesaStatusPage() {
  const { user } = useAuth();

  const defaultVillage = VILLAGES.find((v) => v.name === user?.village) || VILLAGES[0];
  const [selectedVillageId, setSelectedVillageId] = useState(defaultVillage.id);
  const village = VILLAGES.find((v) => v.id === selectedVillageId) || defaultVillage;

  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [catFilter, setCatFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter list submissions
  const filteredSubmissions = useMemo(() => {
    return INITIAL_SUBMISSIONS.filter((item) => {
      // Filter desa jika ada, atau tampilkan sesuai desa yang dipilih
      const matchVillage = item.village.toLowerCase() === village.name.toLowerCase();
      const matchStatus = statusFilter === "all" ? true : item.status === statusFilter;
      const matchCat = catFilter === "all" ? true : item.catId === catFilter;
      const matchSearch = 
        item.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchVillage && matchStatus && matchCat && matchSearch;
    });
  }, [village.name, statusFilter, catFilter, searchQuery]);

  // Hitung agregat desa
  const villageAllItems = INITIAL_SUBMISSIONS.filter(
    (item) => item.village.toLowerCase() === village.name.toLowerCase()
  );
  const countPending = villageAllItems.filter((i) => i.status === "pending").length;
  const countVerified = villageAllItems.filter((i) => i.status === "verified").length;
  const countRejected = villageAllItems.filter((i) => i.status === "rejected").length;

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
              Status Verifikasi Indikator
            </h1>
            <p className="text-slate-500 mt-0.5">
              Pantau status verifikasi dan catatan DPMD untuk setiap data indikator {village.name}.
            </p>
          </div>
        </div>

        {/* Action Button & Village Selector */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm text-sm">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <select
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs sm:text-sm"
            >
              {VILLAGES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/desa/input"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-200 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Input Data Baru</span>
          </Link>
        </div>
      </div>

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
            <span className="text-3xl font-black text-slate-900">{villageAllItems.length}</span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Menunggu DPMD</span>
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

      {/* Info Box mekanisme verifikasi */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-sm text-emerald-900">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Mekanisme Kualitas Data:</span> Setiap nilai indikator yang dikirim akan melalui verifikasi tim DPMD sebelum dihitung ke dalam skor resmi publik. Apabila data ditolak, periksa catatan review dan kirim perbaikan melalui form input.
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50/40">
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Status Buttons */}
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
            {/* Kategori Filter */}
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

            {/* Search Input */}
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
                      Diajukan: <strong>{item.submittedAt}</strong>
                    </span>
                    <span>•</span>
                    <span>Oleh: <strong className="text-slate-700">{item.submittedBy}</strong></span>
                    {item.verifiedBy && (
                      <>
                        <span>•</span>
                        <span>Diverifikasi oleh: <strong className="text-slate-700">{item.verifier}</strong></span>
                      </>
                    )}
                  </div>

                  {/* Catatan Verifikator / Catatan Internal */}
                  {item.notes && (
                    <div className="mt-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-start gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-800">Catatan Review:</strong> {item.notes}
                      </span>
                    </div>
                  )}
                </div>

                {/* Nilai & Status Badge */}
                <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-right">
                    <p className="text-[11px] uppercase font-bold text-slate-400">Nilai Diajukan</p>
                    <p className="text-lg font-black text-slate-900">{item.value}</p>
                  </div>

                  <div className="min-w-[130px] flex justify-end">
                    {item.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Menunggu Verifikasi
                      </span>
                    )}

                    {item.status === "verified" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Telah Disetujui
                      </span>
                    )}

                    {item.status === "rejected" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        Perlu Revisi
                      </span>
                    )}
                  </div>

                  {item.status === "rejected" && (
                    <Link
                      href="/desa/input"
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                    >
                      Revisi Sekarang
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {filteredSubmissions.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Filter className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-700">Tidak ada data pengajuan</h4>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                Tidak ditemukan data dengan filter status atau kata kunci yang dipilih.
              </p>
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
    </div>
  );
}
