"use client";

import { useState, useMemo } from "react";
import { 
  Leaf, 
  ArrowRight, 
  Building, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin,
  Globe2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { 
  VILLAGES, 
  getProvinces, 
  getKabupatens, 
  getKecamatans, 
  getVillagesFiltered, 
  type Village 
} from "@/lib/data/sdgsData";
import type { Role } from "@/lib/auth";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  
  // Role State: "admin" (DPMD / Pemkab) or "desa" (Perangkat Desa)
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  
  // Regional Cascading States
  const provinces = useMemo(() => getProvinces(), []);
  const [selectedProvince, setSelectedProvince] = useState<string>("Jawa Barat");
  
  const kabupatens = useMemo(() => getKabupatens(selectedProvince), [selectedProvince]);
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>("Kab. Bogor");
  
  const kecamatans = useMemo(() => getKecamatans(selectedProvince, selectedKabupaten), [selectedProvince, selectedKabupaten]);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("Ciawi");
  
  const availableVillages = useMemo(() => {
    return getVillagesFiltered(selectedProvince, selectedKabupaten, selectedKecamatan);
  }, [selectedProvince, selectedKabupaten, selectedKecamatan]);
  
  const [selectedVillageId, setSelectedVillageId] = useState<string>("v1");

  // Credentials Form State
  const [email, setEmail] = useState("admin.bogor@dpmd.go.id");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Handle Province Change
  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov);
    const availableKab = getKabupatens(prov);
    const firstKab = availableKab[0] || "";
    setSelectedKabupaten(firstKab);

    const availableKec = getKecamatans(prov, firstKab);
    const firstKec = availableKec[0] || "";
    setSelectedKecamatan(firstKec);

    const vList = getVillagesFiltered(prov, firstKab, firstKec);
    if (vList.length > 0) {
      setSelectedVillageId(vList[0].id);
      updateDefaultCredentials(selectedRole, vList[0], firstKab);
    }
  };

  // Handle Kabupaten Change
  const handleKabupatenChange = (kab: string) => {
    setSelectedKabupaten(kab);
    const availableKec = getKecamatans(selectedProvince, kab);
    const firstKec = availableKec[0] || "";
    setSelectedKecamatan(firstKec);

    const vList = getVillagesFiltered(selectedProvince, kab, firstKec);
    if (vList.length > 0) {
      setSelectedVillageId(vList[0].id);
      updateDefaultCredentials(selectedRole, vList[0], kab);
    }
  };

  // Handle Kecamatan Change
  const handleKecamatanChange = (kec: string) => {
    setSelectedKecamatan(kec);
    const vList = getVillagesFiltered(selectedProvince, selectedKabupaten, kec);
    if (vList.length > 0) {
      setSelectedVillageId(vList[0].id);
      updateDefaultCredentials(selectedRole, vList[0], selectedKabupaten);
    }
  };

  // Handle Village Change
  const handleVillageChange = (vId: string) => {
    setSelectedVillageId(vId);
    const v = VILLAGES.find((x) => x.id === vId);
    if (v) {
      updateDefaultCredentials(selectedRole, v, selectedKabupaten);
    }
  };

  // Update default credentials based on role & region
  const updateDefaultCredentials = (role: Role, village?: Village, kabupaten?: string) => {
    if (role === "admin" || role === "dpmd") {
      const kabSlug = (kabupaten || selectedKabupaten).toLowerCase().replace(/[^a-z0-9]/g, "");
      setEmail(`admin.${kabSlug}@dpmd.go.id`);
      setPassword("admin123");
    } else {
      const targetVillage = village || VILLAGES.find((x) => x.id === selectedVillageId) || VILLAGES[0];
      const cleanName = targetVillage.name.toLowerCase().replace(/desa\s*|nagari\s*/g, "").replace(/\s+/g, "");
      setEmail(`operator@${cleanName}.desa.id`);
      setPassword("desa123");
    }
  };

  // Role Switcher
  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    const curVillage = VILLAGES.find((x) => x.id === selectedVillageId) || availableVillages[0] || VILLAGES[0];
    updateDefaultCredentials(role, curVillage, selectedKabupaten);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const v = VILLAGES.find((x) => x.id === selectedVillageId) || availableVillages[0] || VILLAGES[0];
    await login(
      selectedRole, 
      selectedRole === "desa" ? v.id : undefined,
      selectedRole === "desa" ? `${v.name}, ${selectedKabupaten}` : undefined,
      email,
      password
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-10 px-4">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-emerald-800 to-teal-800 -skew-y-3 origin-top-left -z-10 shadow-2xl"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20 -z-10"></div>

      <div className="w-full max-w-4xl grid md:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Left Side: Brand Banner */}
        <div className="md:col-span-5 bg-slate-900 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 to-slate-950 z-0"></div>
          
          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-md w-fit border border-white/15">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-sm tracking-tight">Sistem Desa Ku</span>
            </Link>
            
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Globe2 className="w-3.5 h-3.5" />
                Cakupan Nasional Indonesia
              </div>
              <h2 className="text-2xl font-black leading-tight text-white">
                Sistem Monitoring & Simulasi SDGs Desa
              </h2>
              <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                Mendukung seluruh wilayah administratif Indonesia dari Sabang sampai Merauke — terintegrasi untuk Pemerintah Kabupaten (DPMD) dan Pemerintah Desa.
              </p>
            </div>

            {/* Quick Region Summary Card */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                Wilayah Aktif Dipilih:
              </span>
              <div className="text-xs space-y-1 text-slate-300">
                <p>• <b>Provinsi:</b> {selectedProvince}</p>
                <p>• <b>Kabupaten:</b> {selectedKabupaten}</p>
                {selectedRole === "desa" && (
                  <>
                    <p>• <b>Kecamatan:</b> {selectedKecamatan}</p>
                    <p>• <b>Desa:</b> {VILLAGES.find(x => x.id === selectedVillageId)?.name || "Pilih Desa"}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative z-10 pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} Gemastik XIX</span>
            <span className="text-emerald-400 font-semibold">Desa Mandiri AI</span>
          </div>
        </div>

        {/* Right Side: Login Form with Cascading Region Selector */}
        <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-2.5 mb-6">
             <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
             </div>
             <span className="font-black text-lg text-slate-900">Sistem Desa Ku</span>
          </div>

          <div className="mb-5">
            <h3 className="text-xl md:text-2xl font-black text-slate-900">Masuk ke Portal</h3>
            <p className="text-xs text-slate-500 mt-1">Pilih peran dan wilayah administratif kerja Anda di Indonesia</p>
          </div>

          {/* 1. Role Switcher Tabs */}
          <div className="space-y-1.5 mb-4">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              1. Pilih Peran Pengguna:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  selectedRole === "admin" || selectedRole === "dpmd"
                    ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20" 
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/60"
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedRole === "admin" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className={`font-bold text-xs ${selectedRole === "admin" ? "text-emerald-950" : "text-slate-800"}`}>
                    Administrator
                  </div>
                  <div className="text-[10px] text-slate-400">DPMD / Pemkab</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("desa")}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  selectedRole === "desa" 
                    ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20" 
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/60"
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedRole === "desa" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className={`font-bold text-xs ${selectedRole === "desa" ? "text-emerald-950" : "text-slate-800"}`}>
                    Perangkat Desa
                  </div>
                  <div className="text-[10px] text-slate-400">Pemerintah Desa</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Cascading Region Selection (Provinsi, Kabupaten, Kecamatan, Desa) */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                2. Pilih Wilayah Administratif:
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-md">
                Nasional
              </span>
            </div>

            {/* Level 1: Provinsi & Kabupaten */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">PROVINSI</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                >
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">KABUPATEN / KOTA</label>
                <select
                  value={selectedKabupaten}
                  onChange={(e) => handleKabupatenChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                >
                  {kabupatens.map((kab) => (
                    <option key={kab} value={kab}>{kab}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Level 2: Kecamatan & Desa (Hanya untuk Perangkat Desa) */}
            {selectedRole === "desa" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-200/60">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">KECAMATAN</label>
                  <select
                    value={selectedKecamatan}
                    onChange={(e) => handleKecamatanChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                  >
                    {kecamatans.map((kec) => (
                      <option key={kec} value={kec}>Kec. {kec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">DESA / KELURAHAN</label>
                  <select
                    value={selectedVillageId}
                    onChange={(e) => handleVillageChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                  >
                    {availableVillages.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 3. Credentials Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                3. Email / Akun Operator:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dpmd.go.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Password:
                </label>
                <button
                  type="button"
                  className="text-[11px] text-emerald-700 font-semibold hover:underline"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 select-none cursor-pointer">
                Ingat sesi login untuk wilayah ini
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Memvalidasi Akses Wilayah...
                  </span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <Link href="/publik" className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors">
                  Atau lihat sebagai <b>Masyarakat Umum (Portal Publik)</b> &rarr;
                </Link>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
