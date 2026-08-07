"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, INDICATORS } from "@/lib/data/sdgsData";
import { Edit3, CheckCircle2, AlertCircle, ClipboardCheck, ArrowRight } from "lucide-react";

export default function DesaInputPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const currentCategory = CATEGORIES.find(c => c.id === activeCategory)!;
  const currentIndicators = INDICATORS.filter(i => i.catId === activeCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Edit3 className="w-6 h-6" />
            </div>
            Input Indikator Desa
          </h1>
          <p className="text-slate-500 mt-2 text-base max-w-3xl">
            Perbarui data riil desa Anda. Data yang diinput akan dikirim ke DPMD untuk proses verifikasi sebelum memperbarui skor publik.
          </p>
        </div>

        <Link
          href="/desa/status"
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 shadow-sm transition-all self-start md:self-auto"
        >
          <ClipboardCheck className="w-4 h-4 text-amber-600" />
          <span>Pantau Status Verifikasi</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Categories */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm sticky top-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Kategori Indikator</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:w-3/4">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900">{currentCategory.label}</h2>
              <p className="text-slate-500 mt-1">{currentCategory.title}</p>
            </div>

            <div className="space-y-6">
              {currentIndicators.map((ind) => (
                <div key={ind.id} className="grid md:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="font-semibold text-slate-800 block">{ind.label}</label>
                    <p className="text-sm text-slate-500 mt-1">{ind.description}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder={`Contoh: ${(ind.maxVal / 2).toFixed(0)}`}
                      min={ind.minVal}
                      max={ind.maxVal}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pr-16"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      {ind.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
                <AlertCircle className="w-4 h-4" />
                Pastikan data sesuai dengan kondisi riil di lapangan.
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-emerald-200"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan & Ajukan"}
              </button>
            </div>
          </form>

          {success && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 font-medium animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Data berhasil disimpan dan masuk ke antrean verifikasi DPMD!</span>
              </div>
              <Link
                href="/desa/status"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1"
              >
                Lihat Status <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
