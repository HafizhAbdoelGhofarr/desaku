"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Village, CATEGORIES, getStatus, getStatusLabel } from "@/lib/data/sdgsData";

// Type-safe wrappers for React 19 compatibility
const MapContainerComponent = MapContainer as unknown as React.ComponentType<Record<string, unknown>>;
const TileLayerComponent = TileLayer as unknown as React.ComponentType<Record<string, unknown>>;
const MarkerComponent = Marker as unknown as React.ComponentType<Record<string, unknown>>;
const PopupComponent = Popup as unknown as React.ComponentType<Record<string, unknown>>;

// Helper component to auto pan/fit bounds when villages change
function MapBoundsUpdater({ villages }: { villages: Village[] }) {
  const map = useMap();

  useEffect(() => {
    if (villages.length === 0) return;
    if (villages.length === 1) {
      map.setView([villages[0].latitude, villages[0].longitude], 13, { animate: true });
    } else {
      const bounds = L.latLngBounds(villages.map((v) => [v.latitude, v.longitude]));
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [villages, map]);

  return null;
}

// Generate custom SVG / HTML Pin with score badge and pulse
function createVillageIcon(score: number, name: string) {
  const status = getStatus(score);
  const color = status === "hijau" ? "#10b981" : status === "kuning" ? "#f59e0b" : "#ef4444";
  const bgBadge = status === "hijau" ? "#ecfdf5" : status === "kuning" ? "#fefce8" : "#fef2f2";
  const textBadge = status === "hijau" ? "#065f46" : status === "kuning" ? "#854d0e" : "#991b1b";

  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="
        display: flex;
        align-items: center;
        gap: 4px;
        background: white;
        border: 2px solid ${color};
        padding: 2px 8px;
        border-radius: 9999px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: sans-serif;
        white-space: nowrap;
        transform: translateY(-4px);
      ">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
        <span style="font-size: 11px; font-weight: 800; color: #1e293b;">${name}</span>
        <span style="
          font-size: 10px;
          font-weight: 900;
          background: ${bgBadge};
          color: ${textBadge};
          padding: 1px 5px;
          border-radius: 999px;
        ">${score}</span>
      </div>
      <div style="
        width: 14px;
        height: 14px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-village-pin",
    iconSize: [120, 42],
    iconAnchor: [60, 36],
    popupAnchor: [0, -36],
  });
}

interface VillageMapInnerProps {
  villages: Village[];
  onSelectVillage?: (village: Village) => void;
  selectedVillageId?: string | null;
  height?: string;
}

export default function VillageMapInner({
  villages,
  onSelectVillage,
  height = "520px",
}: VillageMapInnerProps) {
  const centerLat = useMemo(() => {
    if (villages.length === 0) return -6.65;
    return villages.reduce((sum, v) => sum + v.latitude, 0) / villages.length;
  }, [villages]);

  const centerLng = useMemo(() => {
    if (villages.length === 0) return 106.84;
    return villages.reduce((sum, v) => sum + v.longitude, 0) / villages.length;
  }, [villages]);

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/90 relative z-0" style={{ height }}>
      <MapContainerComponent
        center={[centerLat, centerLng]}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayerComponent
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsUpdater villages={villages} />

        {villages.map((v) => {
          const status = getStatus(v.overallScore);
          const icon = createVillageIcon(v.overallScore, v.name);

          return (
            <MarkerComponent
              key={v.id}
              position={[v.latitude, v.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectVillage && onSelectVillage(v),
              }}
            >
              <PopupComponent className="village-custom-popup">
                <div className="p-2 space-y-3 font-sans" style={{ minWidth: "220px" }}>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Kecamatan {v.kecamatan}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{v.name}</h4>
                    </div>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        status === "hijau"
                          ? "bg-emerald-100 text-emerald-800"
                          : status === "kuning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      Skor {v.overallScore}
                    </span>
                  </div>

                  {/* Pop stats */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-xl">
                    <div>
                      <span className="text-slate-400 block">Status:</span>
                      <strong className="text-slate-700">{getStatusLabel(status)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Penduduk:</span>
                      <strong className="text-slate-700">{v.population.toLocaleString()} jiwa</strong>
                    </div>
                  </div>

                  {/* Top 4 Pillars Mini Progress */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Capaian Pilar Utama</span>
                    <div className="space-y-1 text-[11px]">
                      {CATEGORIES.slice(0, 4).map((cat, i) => (
                        <div key={cat.id} className="flex items-center justify-between text-slate-600">
                          <span>{cat.label}</span>
                          <span className="font-bold text-slate-900">{v.scores[i]}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {onSelectVillage && (
                    <button
                      onClick={() => onSelectVillage(v)}
                      className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors"
                    >
                      Buka Rincian Desa
                    </button>
                  )}
                </div>
              </PopupComponent>
            </MarkerComponent>
          );
        })}
      </MapContainerComponent>
    </div>
  );
}
