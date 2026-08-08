"use client";

import dynamic from "next/dynamic";
import { Village } from "@/lib/data/sdgsData";
import { MapPin, Loader2 } from "lucide-react";

interface VillageMapProps {
  villages: Village[];
  onSelectVillage?: (village: Village) => void;
  selectedVillageId?: string | null;
  height?: string;
}

// Dynamically import Leaflet with ssr: false
const DynamicMap = dynamic(() => import("./VillageMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-slate-100/80 border border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 animate-pulse">
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
        <MapPin className="w-6 h-6 animate-bounce" />
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
        Memuat Peta Spasial Desa...
      </div>
    </div>
  ),
});

export default function VillageMap(props: VillageMapProps) {
  return <DynamicMap {...props} />;
}
