// icon = lucide-react icon name; color is neutral — score colors handle status
export const CATEGORIES = [
  { id: 1, label: "Kesehatan", weight: 0.20, title: "Layanan kesehatan, gizi & sanitasi dasar", color: "#475569", icon: "Heart" },
  { id: 2, label: "Pendidikan", weight: 0.15, title: "Akses & kualitas pendidikan semua jenjang", color: "#475569", icon: "GraduationCap" },
  { id: 3, label: "Ekonomi", weight: 0.20, title: "Pengurangan kemiskinan & penghidupan layak", color: "#475569", icon: "TrendingUp" },
  { id: 4, label: "Infrastruktur dan Aksesibilitas", weight: 0.15, title: "Air bersih, listrik, jalan & sanitasi layak", color: "#475569", icon: "Wrench" },
  { id: 5, label: "Ketahanan Bencana", weight: 0.10, title: "Kesiapsiagaan, mitigasi & pemulihan bencana", color: "#475569", icon: "ShieldAlert" },
  { id: 6, label: "Lingkungan", weight: 0.08, title: "Ekosistem, tutupan hijau & pengelolaan limbah", color: "#475569", icon: "Leaf" },
  { id: 7, label: "Sosial", weight: 0.05, title: "Kesetaraan, kerukunan & partisipasi masyarakat", color: "#475569", icon: "Users" },
  { id: 8, label: "Tata Kelola Pemerintahan", weight: 0.07, title: "Kapasitas pemerintahan desa & layanan publik", color: "#475569", icon: "Landmark" },
];

export type ScoreStatus = "merah" | "kuning" | "hijau";

export function getStatus(score: number): ScoreStatus {
  if (score >= 70) return "hijau";
  if (score >= 40) return "kuning";
  return "merah";
}

export function getStatusColor(status: ScoreStatus) {
  return {
    merah: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", dot: "#dc2626" },
    kuning: { bg: "#fefce8", text: "#ca8a04", border: "#fde68a", dot: "#eab308" },
    hijau: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", dot: "#16a34a" },
  }[status];
}

export function getStatusLabel(status: ScoreStatus) {
  return { merah: "Rendah", kuning: "Sedang", hijau: "Baik" }[status];
}

export interface Village {
  id: string;
  name: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  population: number;
  overallScore: number;
  scores: number[];
  dataCompletion: number;
  latitude: number;
  longitude: number;
}

// Data Desa Lintas Provinsi & Kabupaten Seluruh Indonesia
// scores[0..7] → urutan 8 kategori: Kesehatan, Pendidikan, Ekonomi, Infrastruktur,
//                                    Ketahanan Bencana, Lingkungan, Sosial, Tata Kelola
export const VILLAGES: Village[] = [
  // ─── JAWA BARAT - KAB. BOGOR ───────────────────────────────────────────────
  {
    id: "v1", name: "Desa Sukamaju", provinsi: "Jawa Barat", kabupaten: "Kab. Bogor", kecamatan: "Ciawi", population: 3240,
    overallScore: 78,
    scores: [85, 82, 75, 80, 72, 83, 76, 73],
    dataCompletion: 94,
    latitude: -6.6582, longitude: 106.8432,
  },
  {
    id: "v2", name: "Desa Cibeureum", provinsi: "Jawa Barat", kabupaten: "Kab. Bogor", kecamatan: "Cisarua", population: 2890,
    overallScore: 54,
    scores: [58, 55, 52, 56, 48, 60, 52, 53],
    dataCompletion: 72,
    latitude: -6.7025, longitude: 106.9451,
  },
  {
    id: "v3", name: "Desa Tegalwaru", provinsi: "Jawa Barat", kabupaten: "Kab. Bogor", kecamatan: "Caringin", population: 4120,
    overallScore: 38,
    scores: [40, 38, 35, 38, 32, 42, 38, 35],
    dataCompletion: 58,
    latitude: -6.6854, longitude: 106.8210,
  },
  {
    id: "v4", name: "Desa Pabuaran", provinsi: "Jawa Barat", kabupaten: "Kab. Bogor", kecamatan: "Ciawi", population: 1870,
    overallScore: 67,
    scores: [72, 68, 65, 70, 60, 72, 65, 64],
    dataCompletion: 88,
    latitude: -6.6431, longitude: 106.8524,
  },
  {
    id: "v5", name: "Desa Wargajaya", provinsi: "Jawa Barat", kabupaten: "Kab. Bogor", kecamatan: "Sukaraja", population: 3450,
    overallScore: 82,
    scores: [88, 85, 80, 84, 76, 86, 80, 77],
    dataCompletion: 97,
    latitude: -6.5812, longitude: 106.8398,
  },
  {
    id: "v6", name: "Desa Bojong Murni", provinsi: "Jawa Barat", kabupaten: "Kab. Bogor", kecamatan: "Caringin", population: 2210,
    overallScore: 45,
    scores: [48, 45, 42, 46, 38, 50, 44, 42],
    dataCompletion: 65,
    latitude: -6.6987, longitude: 106.8152,
  },
  {
    id: "v7", name: "Desa Ciderum", provinsi: "Jawa Barat", kabupaten: "Kab. Bogor", kecamatan: "Sukaraja", population: 2780,
    overallScore: 61,
    scores: [65, 62, 58, 63, 55, 66, 60, 58],
    dataCompletion: 81,
    latitude: -6.5945, longitude: 106.8290,
  },
  {
    id: "v8", name: "Desa Gunung Bunder", provinsi: "Jawa Barat", kabupaten: "Kab. Bogor", kecamatan: "Pamijahan", population: 1950,
    overallScore: 29,
    scores: [32, 28, 26, 32, 24, 34, 28, 28],
    dataCompletion: 44,
    latitude: -6.6712, longitude: 106.7015,
  },
  {
    id: "v9", name: "Desa Tugu Selatan", provinsi: "Jawa Barat", kabupaten: "Kab. Bogor", kecamatan: "Cisarua", population: 3800,
    overallScore: 71,
    scores: [75, 70, 72, 68, 65, 78, 70, 70],
    dataCompletion: 89,
    latitude: -6.7115, longitude: 106.9620,
  },

  // ─── JAWA BARAT - KAB. BANDUNG BARAT ─────────────────────────────────────────
  {
    id: "v10", name: "Desa Cibodas", provinsi: "Jawa Barat", kabupaten: "Kab. Bandung Barat", kecamatan: "Lembang", population: 5400,
    overallScore: 74,
    scores: [78, 76, 70, 75, 68, 80, 72, 73],
    dataCompletion: 92,
    latitude: -6.8120, longitude: 107.6410,
  },
  {
    id: "v11", name: "Desa Suntenjaya", provinsi: "Jawa Barat", kabupaten: "Kab. Bandung Barat", kecamatan: "Lembang", population: 4200,
    overallScore: 63,
    scores: [65, 62, 60, 64, 58, 68, 62, 60],
    dataCompletion: 83,
    latitude: -6.8250, longitude: 107.6720,
  },

  // ─── JAWA TENGAH - KAB. BANYUMAS ─────────────────────────────────────────────
  {
    id: "v12", name: "Desa Kemutug Lor", provinsi: "Jawa Tengah", kabupaten: "Kab. Banyumas", kecamatan: "Baturraden", population: 4650,
    overallScore: 81,
    scores: [84, 82, 80, 82, 75, 86, 80, 79],
    dataCompletion: 96,
    latitude: -7.3320, longitude: 109.2240,
  },
  {
    id: "v13", name: "Desa Karangmangu", provinsi: "Jawa Tengah", kabupaten: "Kab. Banyumas", kecamatan: "Baturraden", population: 3900,
    overallScore: 69,
    scores: [72, 70, 66, 71, 62, 74, 68, 66],
    dataCompletion: 87,
    latitude: -7.3410, longitude: 109.2190,
  },
  {
    id: "v14", name: "Desa Kotayasa", provinsi: "Jawa Tengah", kabupaten: "Kab. Banyumas", kecamatan: "Sumbang", population: 5100,
    overallScore: 56,
    scores: [60, 58, 52, 57, 50, 62, 54, 55],
    dataCompletion: 76,
    latitude: -7.3620, longitude: 109.2610,
  },

  // ─── JAWA TENGAH - KAB. MAGELANG ─────────────────────────────────────────────
  {
    id: "v15", name: "Desa Candirejo", provinsi: "Jawa Tengah", kabupaten: "Kab. Magelang", kecamatan: "Borobudur", population: 4350,
    overallScore: 85,
    scores: [88, 86, 84, 86, 80, 90, 84, 82],
    dataCompletion: 98,
    latitude: -7.6180, longitude: 110.2210,
  },
  {
    id: "v16", name: "Desa Wanurejo", provinsi: "Jawa Tengah", kabupaten: "Kab. Magelang", kecamatan: "Borobudur", population: 3750,
    overallScore: 79,
    scores: [82, 80, 77, 80, 74, 84, 78, 77],
    dataCompletion: 94,
    latitude: -7.6040, longitude: 110.2180,
  },

  // ─── JAWA TIMUR - KAB. MALANG ────────────────────────────────────────────────
  {
    id: "v17", name: "Desa Pujon Kidul", provinsi: "Jawa Timur", kabupaten: "Kab. Malang", kecamatan: "Pujon", population: 4100,
    overallScore: 86,
    scores: [90, 87, 85, 87, 82, 88, 84, 85],
    dataCompletion: 99,
    latitude: -7.8650, longitude: 112.4720,
  },
  {
    id: "v18", name: "Desa Pandesari", provinsi: "Jawa Timur", kabupaten: "Kab. Malang", kecamatan: "Pujon", population: 5300,
    overallScore: 66,
    scores: [70, 68, 63, 67, 60, 72, 64, 64],
    dataCompletion: 84,
    latitude: -7.8520, longitude: 112.4630,
  },
  {
    id: "v19", name: "Desa Ngadas", provinsi: "Jawa Timur", kabupaten: "Kab. Malang", kecamatan: "Poncokusumo", population: 2100,
    overallScore: 60,
    scores: [62, 59, 58, 61, 56, 68, 60, 56],
    dataCompletion: 79,
    latitude: -7.9940, longitude: 112.9120,
  },

  // ─── JAWA TIMUR - KAB. BANYUWANGI ───────────────────────────────────────────
  {
    id: "v20", name: "Desa Tamansari", provinsi: "Jawa Timur", kabupaten: "Kab. Banyuwangi", kecamatan: "Licin", population: 4900,
    overallScore: 83,
    scores: [86, 84, 82, 85, 78, 88, 82, 81],
    dataCompletion: 95,
    latitude: -8.2140, longitude: 114.2650,
  },
  {
    id: "v21", name: "Desa Kemiren", provinsi: "Jawa Timur", kabupaten: "Kab. Banyuwangi", kecamatan: "Glagah", population: 3600,
    overallScore: 76,
    scores: [80, 78, 74, 78, 70, 82, 75, 74],
    dataCompletion: 91,
    latitude: -8.1980, longitude: 114.3310,
  },

  // ─── BALI - KAB. BADUNG & GIANYAR ────────────────────────────────────────────
  {
    id: "v22", name: "Desa Tibubeneng", provinsi: "Bali", kabupaten: "Kab. Badung", kecamatan: "Kuta Utara", population: 8900,
    overallScore: 84,
    scores: [87, 85, 86, 88, 76, 85, 82, 83],
    dataCompletion: 97,
    latitude: -8.6520, longitude: 115.1430,
  },
  {
    id: "v23", name: "Desa Baha", provinsi: "Bali", kabupaten: "Kab. Badung", kecamatan: "Mengwi", population: 4500,
    overallScore: 75,
    scores: [78, 76, 73, 76, 70, 80, 74, 73],
    dataCompletion: 90,
    latitude: -8.5410, longitude: 115.1820,
  },
  {
    id: "v24", name: "Desa Singakerta", provinsi: "Bali", kabupaten: "Kab. Gianyar", kecamatan: "Ubud", population: 6200,
    overallScore: 78,
    scores: [82, 79, 76, 80, 72, 84, 76, 75],
    dataCompletion: 93,
    latitude: -8.5320, longitude: 115.2530,
  },

  // ─── SUMATERA BARAT - KAB. TANAH DATAR & AGAM ────────────────────────────────
  {
    id: "v25", name: "Nagari Pariangan", provinsi: "Sumatera Barat", kabupaten: "Kab. Tanah Datar", kecamatan: "Pariangan", population: 4800,
    overallScore: 80,
    scores: [83, 81, 78, 82, 74, 85, 79, 78],
    dataCompletion: 95,
    latitude: -0.4430, longitude: 100.5120,
  },
  {
    id: "v26", name: "Nagari Sungai Pua", provinsi: "Sumatera Barat", kabupaten: "Kab. Agam", kecamatan: "Banuhampu", population: 5600,
    overallScore: 72,
    scores: [75, 72, 70, 74, 66, 78, 71, 70],
    dataCompletion: 89,
    latitude: -0.3540, longitude: 100.4120,
  },

  // ─── SULAWESI SELATAN - KAB. GOWA & TORAJA UTARA ─────────────────────────────
  {
    id: "v27", name: "Desa Pattapang", provinsi: "Sulawesi Selatan", kabupaten: "Kab. Gowa", kecamatan: "Tinggimoncong", population: 3950,
    overallScore: 68,
    scores: [71, 69, 65, 70, 62, 74, 66, 67],
    dataCompletion: 86,
    latitude: -5.2540, longitude: 119.8920,
  },
  {
    id: "v28", name: "Desa Kete Kesu", provinsi: "Sulawesi Selatan", kabupaten: "Kab. Toraja Utara", kecamatan: "Kesu", population: 3100,
    overallScore: 77,
    scores: [80, 77, 75, 79, 72, 82, 76, 75],
    dataCompletion: 92,
    latitude: -2.9830, longitude: 119.8970,
  },

  // ─── NUSA TENGGARA BARAT (NTB) - KAB. LOMBOK BARAT ───────────────────────────
  {
    id: "v29", name: "Desa Sedau", provinsi: "Nusa Tenggara Barat", kabupaten: "Kab. Lombok Barat", kecamatan: "Narmada", population: 4700,
    overallScore: 65,
    scores: [68, 65, 62, 66, 59, 70, 64, 63],
    dataCompletion: 82,
    latitude: -8.5720, longitude: 116.2150,
  },
  {
    id: "v30", name: "Desa Suranadi", provinsi: "Nusa Tenggara Barat", kabupaten: "Kab. Lombok Barat", kecamatan: "Narmada", population: 5200,
    overallScore: 73,
    scores: [76, 74, 70, 75, 67, 80, 72, 71],
    dataCompletion: 90,
    latitude: -8.5610, longitude: 116.2340,
  }
];

// Helper Functions untuk Wilayah Administratif Lintas Indonesia
export function getProvinces(): string[] {
  return Array.from(new Set(VILLAGES.map((v) => v.provinsi)));
}

export function getKabupatens(provinsi?: string): string[] {
  const list = provinsi && provinsi !== "all" 
    ? VILLAGES.filter((v) => v.provinsi === provinsi)
    : VILLAGES;
  return Array.from(new Set(list.map((v) => v.kabupaten)));
}

export function getKecamatans(provinsi?: string, kabupaten?: string): string[] {
  let list = VILLAGES;
  if (provinsi && provinsi !== "all") list = list.filter((v) => v.provinsi === provinsi);
  if (kabupaten && kabupaten !== "all") list = list.filter((v) => v.kabupaten === kabupaten);
  return Array.from(new Set(list.map((v) => v.kecamatan)));
}

export function getVillagesFiltered(provinsi?: string, kabupaten?: string, kecamatan?: string): Village[] {
  let list = VILLAGES;
  if (provinsi && provinsi !== "all") list = list.filter((v) => v.provinsi === provinsi);
  if (kabupaten && kabupaten !== "all") list = list.filter((v) => v.kabupaten === kabupaten);
  if (kecamatan && kecamatan !== "all") list = list.filter((v) => v.kecamatan === kecamatan);
  return list;
}

// ─── Indicators per category ─────────────────────────────────────────────────
export type IndicatorUnit = "%" | "jiwa" | "unit" | "km" | "tahun" | "skor" | "rasio";
export type IndicatorStatus = "pending" | "verified" | "rejected";

export interface Indicator {
  id: string;
  catId: number;
  label: string;
  unit: IndicatorUnit;
  description: string;
  minVal: number;
  maxVal: number;
  weight: number;
  globalWeight: number;
}

export const INDICATORS: Indicator[] = [
  // 1. Kesehatan (catId: 1)
  { id: "k1", catId: 1, label: "Akses layanan kesehatan",        unit: "%", description: "Persentase kemudahan akses", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0500 },
  { id: "k2", catId: 1, label: "Ketersediaan tenaga kesehatan",  unit: "%", description: "Kecukupan tenaga medis", minVal: 0, maxVal: 100, weight: 0.15, globalWeight: 0.0300 },
  { id: "k3", catId: 1, label: "Persentase balita stunting",     unit: "%", description: "Tingkat balita stunting (dikonversi ke skor capaian positif)", minVal: 0, maxVal: 100, weight: 0.30, globalWeight: 0.0600 },
  { id: "k4", catId: 1, label: "Cakupan imunisasi",              unit: "%", description: "Balita dengan imunisasi lengkap", minVal: 0, maxVal: 100, weight: 0.15, globalWeight: 0.0300 },
  { id: "k5", catId: 1, label: "Akses sanitasi layak",           unit: "%", description: "Rumah tangga dengan sanitasi sehat", minVal: 0, maxVal: 100, weight: 0.15, globalWeight: 0.0300 },

  // 2. Pendidikan (catId: 2)
  { id: "p1", catId: 2, label: "Angka partisipasi sekolah",      unit: "%", description: "Partisipasi anak usia sekolah", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0375 },
  { id: "p2", catId: 2, label: "Angka putus sekolah",            unit: "%", description: "Anak putus sekolah (dikonversi ke skor capaian positif)", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0375 },
  { id: "p3", catId: 2, label: "Ketersediaan tenaga pendidik",   unit: "%", description: "Kecukupan guru/dosen", minVal: 0, maxVal: 100, weight: 0.15, globalWeight: 0.0225 },
  { id: "p4", catId: 2, label: "Rasio guru dan siswa",           unit: "%", description: "Keseimbangan guru dan murid", minVal: 0, maxVal: 100, weight: 0.15, globalWeight: 0.0225 },
  { id: "p5", catId: 2, label: "Akses internet pendidikan",      unit: "%", description: "Internet untuk sekolah", minVal: 0, maxVal: 100, weight: 0.20, globalWeight: 0.0300 },

  // 3. Ekonomi (catId: 3)
  { id: "e1", catId: 3, label: "Tingkat kemiskinan",             unit: "%", description: "Tingkat penduduk miskin (dikonversi ke skor capaian positif)", minVal: 0, maxVal: 100, weight: 0.30, globalWeight: 0.0600 },
  { id: "e2", catId: 3, label: "Tingkat pengangguran",           unit: "%", description: "Angka pengangguran (dikonversi ke skor capaian positif)", minVal: 0, maxVal: 100, weight: 0.20, globalWeight: 0.0400 },
  { id: "e3", catId: 3, label: "Jumlah dan perkembangan UMKM",   unit: "%", description: "Pertumbuhan UMKM", minVal: 0, maxVal: 100, weight: 0.20, globalWeight: 0.0400 },
  { id: "e4", catId: 3, label: "Pendapatan masyarakat",          unit: "%", description: "Peningkatan pendapatan rata-rata", minVal: 0, maxVal: 100, weight: 0.20, globalWeight: 0.0400 },
  { id: "e5", catId: 3, label: "Ketersediaan lapangan pekerjaan",unit: "%", description: "Akses kerja lokal", minVal: 0, maxVal: 100, weight: 0.10, globalWeight: 0.0200 },

  // 4. Infrastruktur dan Aksesibilitas (catId: 4)
  { id: "i1", catId: 4, label: "Kondisi jalan",                  unit: "%", description: "Jalan desa kondisi mantap", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0375 },
  { id: "i2", catId: 4, label: "Akses listrik",                  unit: "%", description: "Rumah tangga berlistrik", minVal: 0, maxVal: 100, weight: 0.20, globalWeight: 0.0300 },
  { id: "i3", catId: 4, label: "Akses air bersih",               unit: "%", description: "Sumber air layak", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0375 },
  { id: "i4", catId: 4, label: "Akses internet",                 unit: "%", description: "Cakupan sinyal internet", minVal: 0, maxVal: 100, weight: 0.20, globalWeight: 0.0300 },
  { id: "i5", catId: 4, label: "Kondisi fasilitas umum",         unit: "%", description: "Kelayakan fasum", minVal: 0, maxVal: 100, weight: 0.10, globalWeight: 0.0150 },

  // 5. Ketahanan Bencana (catId: 5)
  { id: "b1", catId: 5, label: "Riwayat kejadian bencana",       unit: "%", description: "Frekuensi/dampak bencana (skor capaian positif)", minVal: 0, maxVal: 100, weight: 0.20, globalWeight: 0.0200 },
  { id: "b2", catId: 5, label: "Ketersediaan jalur evakuasi",    unit: "%", description: "Jalur dan rambu evakuasi", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0250 },
  { id: "b3", catId: 5, label: "Fasilitas tanggap darurat",      unit: "%", description: "Kesiapan shelter/alat", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0250 },
  { id: "b4", catId: 5, label: "Sistem peringatan dini",         unit: "%", description: "Fungsi peringatan dini", minVal: 0, maxVal: 100, weight: 0.30, globalWeight: 0.0300 },

  // 6. Lingkungan (catId: 6)
  { id: "l1", catId: 6, label: "Pengelolaan sampah",             unit: "%", description: "Sistem daur ulang/TPS", minVal: 0, maxVal: 100, weight: 0.30, globalWeight: 0.0240 },
  { id: "l2", catId: 6, label: "Kualitas air",                   unit: "%", description: "Bebas pencemaran", minVal: 0, maxVal: 100, weight: 0.30, globalWeight: 0.0240 },
  { id: "l3", catId: 6, label: "Ruang terbuka hijau",            unit: "%", description: "Cakupan RTH desa", minVal: 0, maxVal: 100, weight: 0.15, globalWeight: 0.0120 },
  { id: "l4", catId: 6, label: "Sanitasi lingkungan",            unit: "%", description: "Saluran pembuangan", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0200 },

  // 7. Sosial (catId: 7)
  { id: "s1", catId: 7, label: "Tingkat keamanan desa",          unit: "%", description: "Kondisi Kamtibmas", minVal: 0, maxVal: 100, weight: 0.30, globalWeight: 0.0150 },
  { id: "s2", catId: 7, label: "Kegiatan sosial masyarakat",     unit: "%", description: "Partisipasi warga", minVal: 0, maxVal: 100, weight: 0.20, globalWeight: 0.0100 },
  { id: "s3", catId: 7, label: "Gotong royong masyarakat",       unit: "%", description: "Frekuensi kerja bakti", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0125 },
  { id: "s4", catId: 7, label: "Konflik sosial",                 unit: "%", description: "Kerukunan (bebas konflik, skor positif)", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0125 },

  // 8. Tata Kelola Pemerintahan (catId: 8)
  { id: "t1", catId: 8, label: "Transparansi informasi desa",    unit: "%", description: "Keterbukaan informasi", minVal: 0, maxVal: 100, weight: 0.30, globalWeight: 0.0210 },
  { id: "t2", catId: 8, label: "Ketersediaan data desa",         unit: "%", description: "Akurasi dan kelengkapan data", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0175 },
  { id: "t3", catId: 8, label: "Kualitas pelayanan publik",      unit: "%", description: "Indeks kepuasan warga", minVal: 0, maxVal: 100, weight: 0.25, globalWeight: 0.0175 },
  { id: "t4", catId: 8, label: "Partisipasi masyarakat",         unit: "%", description: "Keterlibatan dalam musdes", minVal: 0, maxVal: 100, weight: 0.20, globalWeight: 0.0140 },
];

export const PENDING_VERIFICATIONS = [
  { id: "pv1", village: "Desa Tegalwaru",   field: "Angka Kemiskinan",       value: "18.4%", submittedAt: "2 jam lalu",  submittedBy: "Sekdes Budi S.",       catId: 3, status: "pending" as const },
  { id: "pv2", village: "Desa Cibeureum",   field: "Akses Air Bersih",       value: "72.3%", submittedAt: "4 jam lalu",  submittedBy: "Kasi PMD Rina W.",     catId: 4, status: "pending" as const },
  { id: "pv3", village: "Desa Bojong Murni",field: "Angka Stunting",          value: "24.1%", submittedAt: "1 hari lalu", submittedBy: "Sekdes Anton M.",      catId: 1, status: "pending" as const },
  { id: "pv4", village: "Desa Gunung Bunder",field:"Elektrifikasi Rumah",    value: "61.5%", submittedAt: "1 hari lalu", submittedBy: "Kades Surya P.",       catId: 4, status: "pending" as const },
  { id: "pv5", village: "Desa Ciderum",     field: "Kepemilikan Akta Kelahiran",value:"88.2%",submittedAt:"2 hari lalu",submittedBy:"Kasi Pemerintahan",     catId: 8, status: "pending" as const },
];

export const AI_RECOMMENDATIONS = [
  {
    id: "r1",
    village: "Desa Gunung Bunder",
    kecamatan: "Pamijahan",
    urgency: "kritis",
    overallScore: 29,
    title: "Intervensi Mendesak: Ekonomi & Infrastruktur Dasar",
    summary: "Skor terendah di kabupaten (29/100). Tiga kategori berada di level kritis dan saling mengunci kemajuan.",
    rootIndicators: [
      { catId: 3, name: "Kemiskinan Ekstrem",     score: 26, trend: "down"   },
      { catId: 4, name: "Akses Sanitasi Layak",   score: 32, trend: "stable" },
      { catId: 1, name: "Kesehatan Ibu & Anak",   score: 32, trend: "down"   },
    ],
    causalChain: "Kemiskinan ekstrem (Ekonomi, skor 26) membatasi investasi keluarga pada infrastruktur dasar — hanya 31% rumah tangga memiliki jamban layak (Infrastruktur, skor 32). Kondisi sanitasi buruk mendorong prevalensi diare dan stunting hingga 28.4%, menekan produktivitas kerja (Ekonomi), memperparah siklus kemiskinan.",
    correlatedCats: [3, 1, 2],
    intervention: "Program RTLH + pembangunan MCK komunal + intervensi gizi 1000 HPK. Estimasi dampak: +12 poin skor dalam 18 bulan.",
    dataQuality: 44,
    dataWarning: "Data tidak lengkap (44%). Rekomendasi berdasarkan data parsial — prioritaskan pendataan lapangan sebelum intervensi besar.",
  },
  {
    id: "r2",
    village: "Desa Tegalwaru",
    kecamatan: "Caringin",
    urgency: "tinggi",
    overallScore: 38,
    title: "Kesenjangan Pendidikan & Ekonomi",
    summary: "Angka putus sekolah 12% dan tingkat pengangguran 18% menciptakan spiral penurunan kapasitas SDM.",
    rootIndicators: [
      { catId: 2, name: "Angka Putus Sekolah",    score: 38, trend: "down"   },
      { catId: 3, name: "Tingkat Pengangguran",   score: 35, trend: "stable" },
      { catId: 7, name: "Rasio Ketimpangan Sosial",score: 38, trend: "down"  },
    ],
    causalChain: "Angka putus sekolah tinggi (12%) berakar pada kemiskinan keluarga dan minimnya akses transportasi ke SMP/SMA (Pendidikan, skor 38). Generasi tanpa kualifikasi mengisi pool pengangguran (18.4%), memperlebar kesenjangan sosial (Sosial, skor 38) dan mengurangi basis pajak desa untuk membiayai layanan publik.",
    correlatedCats: [3, 7, 4],
    intervention: "Beasiswa desa + program magang UMKM lokal + pembangunan jalan akses sekolah. Estimasi dampak: +8 poin skor dalam 24 bulan.",
    dataQuality: 58,
    dataWarning: "Kelengkapan data sedang (58%). Verifikasi angka pengangguran — sumber data masih manual.",
  },
  {
    id: "r3",
    village: "Desa Bojong Murni",
    kecamatan: "Caringin",
    urgency: "tinggi",
    overallScore: 45,
    title: "Stunting & Gizi Balita",
    summary: "Prevalensi stunting 24.1% jauh di atas rata-rata kabupaten 14.2%. Intervensi sensitif dan spesifik diperlukan.",
    rootIndicators: [
      { catId: 1, name: "Prevalensi Stunting",    score: 48, trend: "down"   },
      { catId: 4, name: "Akses Air Minum Aman",   score: 46, trend: "stable" },
      { catId: 8, name: "Cakupan Layanan Posyandu",score: 44, trend: "up"   },
    ],
    causalChain: "Stunting tinggi (24.1%) berkorelasi kuat dengan kualitas air minum — 43% sumber air masih dari sumur tanpa pengolahan (Infrastruktur, skor 46). Cakupan Posyandu meningkat namun kapasitas kader dan ketersediaan PMT masih terbatas (Tata Kelola, skor 44).",
    correlatedCats: [3, 2, 4],
    intervention: "Program air minum desa + penguatan kapasitas kader Posyandu + PMT berbasis pangan lokal. Estimasi dampak: +6 poin skor dalam 12 bulan.",
    dataQuality: 65,
    dataWarning: null,
  },
];

export interface CitizenReport {
  id: string;
  villageId?: string;
  village: string;
  villageName?: string;
  kecamatan: string;
  catId: number;
  category?: string;
  title: string;
  description: string;
  location: string;
  author: string;
  submittedAt: string;
  createdAt?: string;
  status: "terkirim" | "ditinjau" | "ditindaklanjuti";
  responseNote?: string;
  adminResponse?: string;
  upvotes: number;
}

export const CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: "rep-1",
    villageId: "v1",
    village: "Desa Sukamaju",
    villageName: "Desa Sukamaju",
    kecamatan: "Ciawi",
    catId: 4,
    category: "infrastruktur",
    title: "Jembatan Penghubung Dusun 2 dan Dusun 3 Rusak Terkikis Air",
    description: "Jembatan bambu darurat sudah mulai lapuk saat musim hujan, membahayakan anak sekolah dan petani pengangkut sayur. Mohon diprioritaskan perbaikan permanen.",
    location: "Dusun 2 RT 04 / RW 02",
    author: "Bapak Hendra (Tokoh Warga)",
    submittedAt: "06 Agu 2026",
    createdAt: "06 Agu 2026",
    status: "ditindaklanjuti",
    responseNote: "Sudah dimasukkan dalam musyawarah RKPDes 2026 tahap 2 dan disurvei oleh tim Administrator Kabupaten.",
    adminResponse: "Sudah dimasukkan dalam musyawarah RKPDes 2026 tahap 2 dan disurvei oleh tim Administrator Kabupaten.",
    upvotes: 42,
  },
  {
    id: "rep-2",
    villageId: "v3",
    village: "Desa Bojong Murni",
    villageName: "Desa Bojong Murni",
    kecamatan: "Caringin",
    catId: 1,
    category: "kesehatan",
    title: "Kekurangan Suplemen Vitamin & Alat Timbang Digital di Posyandu Melati",
    description: "Untuk pencegahan stunting balita di RW 03, alat timbang sering eror dan persediaan PMT biskuit gizi habis sejak bulan lalu.",
    location: "Posyandu Melati RW 03",
    author: "Ibu Siti Fatimah (Kader Posyandu)",
    submittedAt: "05 Agu 2026",
    createdAt: "05 Agu 2026",
    status: "ditinjau",
    responseNote: "Pemerintah desa sedang mengoordinasikan pengadaan alat bersama Puskesmas Kecamatan.",
    adminResponse: "Pemerintah desa sedang mengoordinasikan pengadaan alat bersama Puskesmas Kecamatan.",
    upvotes: 38,
  },
  {
    id: "rep-3",
    villageId: "v6",
    village: "Desa Tegalwaru",
    villageName: "Desa Tegalwaru",
    kecamatan: "Ciampea",
    catId: 3,
    category: "ekonomi",
    title: "Usulan Pelatihan Pemasaran Digital untuk Pengrajin Keramik Lokal",
    description: "Banyak pemuda di RW 01 memiliki potensi kerajinan tanah liat dan olahan singkong tapi kesulitan memasarkan secara online ke luar kota.",
    location: "Sentra Kerajinan RW 01",
    author: "Rian Pratama",
    submittedAt: "04 Agu 2026",
    createdAt: "04 Agu 2026",
    status: "ditindaklanjuti",
    responseNote: "Diagendakan pelatihan digital marketing bekerjasama dengan BUMDes pada bulan depan.",
    adminResponse: "Diagendakan pelatihan digital marketing bekerjasama dengan BUMDes pada bulan depan.",
    upvotes: 27,
  },
  {
    id: "rep-4",
    villageId: "v1",
    village: "Desa Sukamaju",
    villageName: "Desa Sukamaju",
    kecamatan: "Ciawi",
    catId: 6,
    category: "lingkungan",
    title: "Tumpukan Sampah Liar di Dekat Saluran Irigasi Sawah",
    description: "Warga luar desa sering membuang sampah kantong plastik sembarangan di pinggir jalan irigasi, menyumbat aliran air ke 15 hektar sawah.",
    location: "Jl. Irigasi Blok Barat RT 02",
    author: "Warga Anonim",
    submittedAt: "02 Agu 2026",
    createdAt: "02 Agu 2026",
    status: "terkirim",
    upvotes: 19,
  },
  {
    id: "rep-5",
    villageId: "v4",
    village: "Desa Gunung Bunder 1",
    villageName: "Desa Gunung Bunder 1",
    kecamatan: "Pamijahan",
    catId: 5,
    category: "bencana",
    title: "Pemasangan Rambu Jalur Evakuasi dan Talud Tebing Rawan Longsor",
    description: "Tebing di samping jalan utama RT 05 sudah mulai retak 5 cm setelah hujan deras berturut-turut. Butuh penahan tebing sementara dan rambu peringatan.",
    location: "Kp. Gunung Bunder Atas RT 05",
    author: "Agus S. (Relawan Desa)",
    submittedAt: "01 Agu 2026",
    createdAt: "01 Agu 2026",
    status: "ditindaklanjuti",
    responseNote: "BPBD dan Tim Siaga Bencana Desa telah memasang terpal penahan dan barikade jalan.",
    adminResponse: "BPBD dan Tim Siaga Bencana Desa telah memasang terpal penahan dan barikade jalan.",
    upvotes: 56,
  },
];
