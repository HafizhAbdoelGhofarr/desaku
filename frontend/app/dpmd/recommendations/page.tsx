"use client";

import { AI_RECOMMENDATIONS, getStatusColor, getStatus } from "@/lib/data/sdgsData";
import { Sparkles, MapPin, AlertTriangle, ChevronRight, Activity, Zap } from "lucide-react";

export default function RecommendationsPage() {
  return (
    <div className="space-y-8 pb-10 max-w-6xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          Rekomendasi AI
        </h1>
        <p className="text-slate-500 mt-2 text-lg max-w-3xl">
          Analisis mendalam berbasis kecerdasan buatan untuk mengidentifikasi akar masalah dan mensimulasikan intervensi paling efektif untuk setiap desa.
        </p>
      </div>

      <div className="space-y-6">
        {AI_RECOMMENDATIONS.map((rec) => {
          const colors = getStatusColor(getStatus(rec.overallScore));
          
          return (
            <div key={rec.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group hover:border-indigo-200 transition-colors">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                
                {/* Left Col: Header & Status */}
                <div className="md:w-1/3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-700">{rec.village}</span>
                      <span className="text-slate-400 text-sm">• {rec.kecamatan}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-indigo-700 transition-colors">
                      {rec.title}
                    </h2>
                    
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-rose-50 border-rose-100 text-rose-700 text-sm font-semibold mb-6">
                      <AlertTriangle className="w-4 h-4" />
                      Urgensi: {rec.urgency.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Skor Saat Ini</span>
                    <span className="text-2xl font-black" style={{ color: colors.text }}>
                      {rec.overallScore}<span className="text-sm text-slate-400 font-medium">/100</span>
                    </span>
                  </div>
                </div>

                {/* Right Col: Content */}
                <div className="md:w-2/3 space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-indigo-500" />
                      Akar Permasalahan (Causal Chain)
                    </h3>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {rec.causalChain}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      Rekomendasi Intervensi
                    </h3>
                    <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                      <p className="text-amber-900 font-medium">{rec.intervention}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                      Simulasikan Kebijakan Ini di What-If
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
