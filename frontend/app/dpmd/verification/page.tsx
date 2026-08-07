"use client";

import { useState } from "react";
import { PENDING_VERIFICATIONS, CATEGORIES } from "@/lib/data/sdgsData";
import { Search, Filter, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function VerificationPage() {
  const [data, setData] = useState(PENDING_VERIFICATIONS);

  const handleAction = (id: string, action: "verified" | "rejected") => {
    setData((prev) => prev.filter((item) => item.id !== id));
    // In a real app, this would call the API
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verifikasi Data</h1>
          <p className="text-slate-500 mt-2">Tinjau dan setujui input indikator terbaru dari perangkat desa.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari desa atau indikator..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors w-full sm:w-auto font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="font-semibold p-4 px-6">Desa</th>
                <th className="font-semibold p-4">Indikator</th>
                <th className="font-semibold p-4">Nilai Baru</th>
                <th className="font-semibold p-4">Dikirim Oleh</th>
                <th className="font-semibold p-4">Waktu</th>
                <th className="font-semibold p-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.map((item) => {
                const cat = CATEGORIES.find(c => c.id === item.catId);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 px-6">
                      <div className="font-semibold text-slate-900">{item.village}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-700">{item.field}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{cat?.label}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                        {item.value}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-700">{item.submittedBy}</div>
                    </td>
                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {item.submittedAt}
                      </div>
                    </td>
                    <td className="p-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAction(item.id, "rejected")}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                          title="Tolak"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction(item.id, "verified")}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Setujui
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <CheckCircle2 className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-700">Semua data sudah diverifikasi!</p>
                    <p>Tidak ada pengajuan data yang menunggu persetujuan saat ini.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
