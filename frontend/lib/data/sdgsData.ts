// icon = lucide-react icon name; color is neutral — score colors handle status
export const CATEGORIES = [
  { id: 1, label: "Kesehatan",                    title: "Layanan kesehatan, gizi & sanitasi dasar",           color: "#475569", icon: "Heart" },
  { id: 2, label: "Pendidikan",                   title: "Akses & kualitas pendidikan semua jenjang",          color: "#475569", icon: "GraduationCap" },
  { id: 3, label: "Ekonomi",                      title: "Pengurangan kemiskinan & penghidupan layak",         color: "#475569", icon: "TrendingUp" },
  { id: 4, label: "Infrastruktur & Aksesibilitas",title: "Air bersih, listrik, jalan & sanitasi layak",       color: "#475569", icon: "Wrench" },
  { id: 5, label: "Ketahanan Bencana",             title: "Kesiapsiagaan, mitigasi & pemulihan bencana",       color: "#475569", icon: "ShieldAlert" },
  { id: 6, label: "Lingkungan",                   title: "Ekosistem, tutupan hijau & pengelolaan limbah",      color: "#475569", icon: "Leaf" },
  { id: 7, label: "Sosial",                       title: "Kesetaraan, kerukunan & partisipasi masyarakat",    color: "#475569", icon: "Users" },
  { id: 8, label: "Tata Kelola",                  title: "Kapasitas pemerintahan desa & layanan publik",       color: "#475569", icon: "Landmark" },
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

// scores[0..7] → urutan 8 kategori: Kesehatan, Pendidikan, Ekonomi, Infrastruktur,
//                                    Ketahanan Bencana, Lingkungan, Sosial, Tata Kelola
export const VILLAGES = [
  {
    id: "v1", name: "Desa Sukamaju", kecamatan: "Ciawi", population: 3240,
    overallScore: 78,
    scores: [85, 82, 75, 80, 72, 83, 76, 73],
    dataCompletion: 94,
  },
  {
    id: "v2", name: "Desa Cibeureum", kecamatan: "Cisarua", population: 2890,
    overallScore: 54,
    scores: [58, 55, 52, 56, 48, 60, 52, 53],
    dataCompletion: 72,
  },
  {
    id: "v3", name: "Desa Tegalwaru", kecamatan: "Caringin", population: 4120,
    overallScore: 38,
    scores: [40, 38, 35, 38, 32, 42, 38, 35],
    dataCompletion: 58,
  },
  {
    id: "v4", name: "Desa Pabuaran", kecamatan: "Ciawi", population: 1870,
    overallScore: 67,
    scores: [72, 68, 65, 70, 60, 72, 65, 64],
    dataCompletion: 88,
  },
  {
    id: "v5", name: "Desa Wargajaya", kecamatan: "Sukaraja", population: 3450,
    overallScore: 82,
    scores: [88, 85, 80, 84, 76, 86, 80, 77],
    dataCompletion: 97,
  },
  {
    id: "v6", name: "Desa Bojong Murni", kecamatan: "Caringin", population: 2210,
    overallScore: 45,
    scores: [48, 45, 42, 46, 38, 50, 44, 42],
    dataCompletion: 65,
  },
  {
    id: "v7", name: "Desa Ciderum", kecamatan: "Sukaraja", population: 2780,
    overallScore: 61,
    scores: [65, 62, 58, 63, 55, 66, 60, 58],
    dataCompletion: 81,
  },
  {
    id: "v8", name: "Desa Gunung Bunder", kecamatan: "Pamijahan", population: 1950,
    overallScore: 29,
    scores: [32, 28, 26, 32, 24, 34, 28, 28],
    dataCompletion: 44,
  },
];

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
}

export const INDICATORS: Indicator[] = [
  // 1. Kesehatan
  { id: "k1", catId: 1, label: "Angka Stunting",               unit: "%",    description: "Persentase balita dengan tinggi badan di bawah standar",  minVal: 0,  maxVal: 100 },
  { id: "k2", catId: 1, label: "Cakupan Imunisasi Dasar",      unit: "%",    description: "Persentase bayi yang mendapat imunisasi dasar lengkap",    minVal: 0,  maxVal: 100 },
  { id: "k3", catId: 1, label: "Akses Sanitasi Layak",         unit: "%",    description: "Persentase rumah tangga dengan jamban sehat",              minVal: 0,  maxVal: 100 },
  { id: "k4", catId: 1, label: "Akses Puskesmas/Pustu",        unit: "km",   description: "Jarak rata-rata warga ke fasilitas kesehatan terdekat",    minVal: 0,  maxVal: 50  },
  { id: "k5", catId: 1, label: "Tenaga Kesehatan",             unit: "jiwa", description: "Jumlah tenaga kesehatan aktif di desa",                   minVal: 0,  maxVal: 50  },
  { id: "k6", catId: 1, label: "Akses Air Bersih",             unit: "%",    description: "Persentase rumah tangga dengan sumber air bersih",         minVal: 0,  maxVal: 100 },

  // 2. Pendidikan
  { id: "p1", catId: 2, label: "APK Sekolah Dasar",            unit: "%",    description: "Angka Partisipasi Kasar jenjang SD",                     minVal: 0,  maxVal: 100 },
  { id: "p2", catId: 2, label: "APK Sekolah Menengah",         unit: "%",    description: "Angka Partisipasi Kasar jenjang SMP",                    minVal: 0,  maxVal: 100 },
  { id: "p3", catId: 2, label: "Angka Putus Sekolah",          unit: "%",    description: "Persentase anak usia sekolah yang tidak bersekolah",       minVal: 0,  maxVal: 100 },
  { id: "p4", catId: 2, label: "Rasio Guru–Murid",             unit: "rasio",description: "Perbandingan jumlah guru aktif terhadap murid",            minVal: 0,  maxVal: 50  },
  { id: "p5", catId: 2, label: "Angka Buta Huruf",             unit: "%",    description: "Persentase penduduk dewasa tidak dapat membaca",           minVal: 0,  maxVal: 100 },
  { id: "p6", catId: 2, label: "Fasilitas PAUD",               unit: "unit", description: "Jumlah lembaga PAUD aktif di desa",                       minVal: 0,  maxVal: 20  },

  // 3. Ekonomi
  { id: "e1", catId: 3, label: "Angka Kemiskinan",             unit: "%",    description: "Persentase penduduk di bawah garis kemiskinan",            minVal: 0,  maxVal: 100 },
  { id: "e2", catId: 3, label: "Tingkat Pengangguran",         unit: "%",    description: "Persentase angkatan kerja yang tidak bekerja",             minVal: 0,  maxVal: 100 },
  { id: "e3", catId: 3, label: "UMKM Aktif",                   unit: "unit", description: "Jumlah usaha mikro kecil menengah yang beroperasi",        minVal: 0,  maxVal: 500 },
  { id: "e4", catId: 3, label: "BUMDes Aktif",                 unit: "unit", description: "Jumlah BUMDes yang beroperasi secara aktif",              minVal: 0,  maxVal: 10  },
  { id: "e5", catId: 3, label: "Penerima PKH/Bansos",          unit: "jiwa", description: "Jumlah keluarga penerima manfaat program bantuan sosial",  minVal: 0,  maxVal: 2000},
  { id: "e6", catId: 3, label: "Akses Kredit Usaha",           unit: "%",    description: "Persentase pelaku usaha yang dapat akses permodalan",      minVal: 0,  maxVal: 100 },

  // 4. Infrastruktur & Aksesibilitas
  { id: "i1", catId: 4, label: "Jalan Mantap",                 unit: "%",    description: "Persentase panjang jalan desa dalam kondisi baik",         minVal: 0,  maxVal: 100 },
  { id: "i2", catId: 4, label: "Elektrifikasi Rumah",          unit: "%",    description: "Persentase rumah tangga dengan akses listrik",             minVal: 0,  maxVal: 100 },
  { id: "i3", catId: 4, label: "Akses Air Minum",              unit: "%",    description: "Persentase RT yang terlayani PDAM/air pipa",               minVal: 0,  maxVal: 100 },
  { id: "i4", catId: 4, label: "Cakupan Internet",             unit: "%",    description: "Persentase wilayah desa dengan sinyal 4G/internet",        minVal: 0,  maxVal: 100 },
  { id: "i5", catId: 4, label: "Gedung Pelayanan Publik",      unit: "unit", description: "Jumlah gedung kantor/balai desa dalam kondisi baik",       minVal: 0,  maxVal: 10  },
  { id: "i6", catId: 4, label: "Panjang Jalan Desa",           unit: "km",   description: "Total panjang jalan yang menjadi tanggung jawab desa",     minVal: 0,  maxVal: 100 },

  // 5. Ketahanan Bencana
  { id: "b1", catId: 5, label: "Peta Risiko Bencana",          unit: "skor", description: "Ketersediaan peta risiko (0=tidak ada, 100=lengkap)",      minVal: 0,  maxVal: 100 },
  { id: "b2", catId: 5, label: "Forum PRB Aktif",              unit: "unit", description: "Jumlah forum pengurangan risiko bencana aktif",            minVal: 0,  maxVal: 5   },
  { id: "b3", catId: 5, label: "Simulasi/Latihan Bencana",     unit: "unit", description: "Frekuensi latihan evakuasi per tahun",                     minVal: 0,  maxVal: 12  },
  { id: "b4", catId: 5, label: "Tempat Evakuasi",              unit: "unit", description: "Jumlah shelter/titik evakuasi yang layak",                 minVal: 0,  maxVal: 10  },
  { id: "b5", catId: 5, label: "Sistem Peringatan Dini",       unit: "unit", description: "Jumlah alat/sistem peringatan dini yang berfungsi",        minVal: 0,  maxVal: 10  },
  { id: "b6", catId: 5, label: "Dana Siaga Bencana",           unit: "unit", description: "Ketersediaan dana desa untuk tanggap darurat (0/1)",       minVal: 0,  maxVal: 1   },

  // 6. Lingkungan
  { id: "l1", catId: 6, label: "Tutupan Lahan Hijau",          unit: "%",    description: "Persentase lahan desa bervegetasi/hutan",                  minVal: 0,  maxVal: 100 },
  { id: "l2", catId: 6, label: "Pengelolaan Sampah",           unit: "%",    description: "Persentase RT yang memiliki akses pengelolaan sampah",     minVal: 0,  maxVal: 100 },
  { id: "l3", catId: 6, label: "Kualitas Air Sungai",          unit: "skor", description: "Skor kualitas air badan air utama (0–100)",                minVal: 0,  maxVal: 100 },
  { id: "l4", catId: 6, label: "Lahan Kritis",                 unit: "%",    description: "Persentase lahan yang mengalami degradasi",                minVal: 0,  maxVal: 100 },
  { id: "l5", catId: 6, label: "Energi Terbarukan",            unit: "unit", description: "Jumlah instalasi energi terbarukan di desa",               minVal: 0,  maxVal: 50  },
  { id: "l6", catId: 6, label: "Kelompok Peduli Lingkungan",   unit: "unit", description: "Jumlah kelompok/komunitas lingkungan aktif",               minVal: 0,  maxVal: 20  },

  // 7. Sosial
  { id: "s1", catId: 7, label: "Keaktifan Posyandu",           unit: "%",    description: "Persentase Posyandu yang aktif rutin setiap bulan",        minVal: 0,  maxVal: 100 },
  { id: "s2", catId: 7, label: "Pernikahan Dini",              unit: "%",    description: "Persentase pernikahan di bawah usia 19 tahun",             minVal: 0,  maxVal: 100 },
  { id: "s3", catId: 7, label: "Partisipasi Musyawarah Desa",  unit: "%",    description: "Tingkat kehadiran warga dalam MusDes",                    minVal: 0,  maxVal: 100 },
  { id: "s4", catId: 7, label: "Kasus KDRT Dilaporkan",        unit: "unit", description: "Jumlah kasus KDRT yang resmi dilaporkan dalam 1 tahun",   minVal: 0,  maxVal: 100 },
  { id: "s5", catId: 7, label: "Kepesertaan BPJS Kesehatan",   unit: "%",    description: "Persentase penduduk yang aktif sebagai peserta BPJS",      minVal: 0,  maxVal: 100 },
  { id: "s6", catId: 7, label: "Kelompok Sosial Aktif",        unit: "unit", description: "Jumlah karang taruna, PKK, koperasi yang aktif",          minVal: 0,  maxVal: 30  },

  // 8. Tata Kelola
  { id: "t1", catId: 8, label: "Skor ProDes Kabupaten",        unit: "skor", description: "Nilai profil desa dari sistem ProDeskel",                  minVal: 0,  maxVal: 100 },
  { id: "t2", catId: 8, label: "Realisasi APBDes",             unit: "%",    description: "Persentase realisasi belanja APBDes tahun berjalan",        minVal: 0,  maxVal: 100 },
  { id: "t3", catId: 8, label: "Laporan Keuangan Tepat Waktu", unit: "unit", description: "Jumlah laporan keuangan yang diserahkan tepat waktu",      minVal: 0,  maxVal: 4   },
  { id: "t4", catId: 8, label: "Pengaduan Tertangani",         unit: "%",    description: "Persentase pengaduan warga yang ditindaklanjuti",          minVal: 0,  maxVal: 100 },
  { id: "t5", catId: 8, label: "Website/Sistem Informasi Desa",unit: "unit", description: "Ketersediaan website/SID aktif (0=tidak ada, 1=ada)",     minVal: 0,  maxVal: 1   },
  { id: "t6", catId: 8, label: "Aparatur Desa Terlatih",       unit: "jiwa", description: "Jumlah aparatur yang mengikuti pelatihan tahun ini",       minVal: 0,  maxVal: 50  },
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
  village: string;
  kecamatan: string;
  catId: number;
  title: string;
  description: string;
  location: string;
  author: string;
  submittedAt: string;
  status: "terkirim" | "ditinjau" | "ditindaklanjuti";
  responseNote?: string;
  upvotes: number;
}

export const CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: "rep-1",
    village: "Desa Sukamaju",
    kecamatan: "Ciawi",
    catId: 4, // Infrastruktur
    title: "Jembatan Penghubung Dusun 2 dan Dusun 3 Rusak Terkikis Air",
    description: "Jembatan bambu darurat sudah mulai lapuk saat musim hujan, membahayakan anak sekolah dan petani pengangkut sayur. Mohon diprioritaskan perbaikan permanen.",
    location: "Dusun 2 RT 04 / RW 02",
    author: "Bapak Hendra (Tokoh Warga)",
    submittedAt: "06 Agu 2026",
    status: "ditindaklanjuti",
    responseNote: "Sudah dimasukkan dalam musyawarah RKPDes 2026 tahap 2 dan disurvei oleh tim DPMD.",
    upvotes: 42,
  },
  {
    id: "rep-2",
    village: "Desa Bojong Murni",
    kecamatan: "Caringin",
    catId: 1, // Kesehatan
    title: "Kekurangan Suplemen Vitamin & Alat Timbang Digital di Posyandu Melati",
    description: "Untuk pencegahan stunting balita di RW 03, alat timbang sering eror dan persediaan PMT biskuit gizi habis sejak bulan lalu.",
    location: "Posyandu Melati RW 03",
    author: "Ibu Siti Fatimah (Kader Posyandu)",
    submittedAt: "05 Agu 2026",
    status: "ditinjau",
    responseNote: "Pemerintah desa sedang mengoordinasikan pengadaan alat bersama Puskesmas Kecamatan.",
    upvotes: 38,
  },
  {
    id: "rep-3",
    village: "Desa Tegalwaru",
    kecamatan: "Ciampea",
    catId: 3, // Ekonomi
    title: "Usulan Pelatihan Pemasaran Digital untuk Pengrajin Keramik Lokal",
    description: "Banyak pemuda di RW 01 memiliki potensi kerajinan tanah liat dan olahan singkong tapi kesulitan memasarkan secara online ke luar kota.",
    location: "Sentra Kerajinan RW 01",
    author: "Rian Pratama",
    submittedAt: "04 Agu 2026",
    status: "ditindaklanjuti",
    responseNote: "Diagendakan pelatihan digital marketing bekerjasama dengan BUMDes pada bulan depan.",
    upvotes: 27,
  },
  {
    id: "rep-4",
    village: "Desa Sukamaju",
    kecamatan: "Ciawi",
    catId: 6, // Lingkungan
    title: "Tumpukan Sampah Liar di Dekat Saluran Irigasi Sawah",
    description: "Warga luar desa sering membuang sampah kantong plastik sembarangan di pinggir jalan irigasi, menyumbat aliran air ke 15 hektar sawah.",
    location: "Jl. Irigasi Blok Barat RT 02",
    author: "Warga Anonim",
    submittedAt: "02 Agu 2026",
    status: "terkirim",
    upvotes: 19,
  },
  {
    id: "rep-5",
    village: "Desa Gunung Bunder 1",
    kecamatan: "Pamijahan",
    catId: 5, // Ketahanan Bencana
    title: "Pemasangan Rambu Jalur Evakuasi dan Talud Tebing Rawan Longsor",
    description: "Tebing di samping jalan utama RT 05 sudah mulai retak 5 cm setelah hujan deras berturut-turut. Butuh penahan tebing sementara dan rambu peringatan.",
    location: "Kp. Gunung Bunder Atas RT 05",
    author: "Agus S. (Relawan Desa)",
    submittedAt: "01 Agu 2026",
    status: "ditindaklanjuti",
    responseNote: "BPBD dan Tim Siaga Bencana Desa telah memasang terpal penahan dan barikade jalan.",
    upvotes: 56,
  },
];

