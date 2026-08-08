import { CATEGORIES } from "./sdgsData";

export interface RippleEffect {
  pillarId: number;
  pillarName: string;
  delta: number;
  rationale: string;
}

export interface PolicyPreset {
  id: string;
  title: string;
  categoryName: string;
  description: string;
  defaultBudget: number; // in Rupiah
  targetDusun: string;
  primaryPillarId: number;
  primaryDelta: number;
  primaryRationale: string;
  rippleEffects: RippleEffect[];
  causalSummary: string;
  recommendations: string[];
}

export interface CausalSimulationResult {
  programTitle: string;
  budget: number;
  targetDusun: string;
  primaryPillar: {
    id: number;
    name: string;
    delta: number;
    rationale: string;
  };
  rippleEffects: RippleEffect[];
  allPillarsDelta: number[]; // Index 0..7 delta for each category
  simulatedScores: number[]; // Index 0..7 new scores (bounded 0..100)
  oldOverallScore: number;
  newOverallScore: number;
  deltaOverallScore: number;
  causalSummary: string;
  recommendations: string[];
  roiMetric: string; // Poin / Rp 10 Juta
}

export const REALISTIC_POLICY_PRESETS: PolicyPreset[] = [
  {
    id: "preset-irigasi-jalan",
    title: "Pembangunan Jalan Usaha Tani & Saluran Irigasi Sawah",
    categoryName: "Infrastruktur & Pertanian",
    description: "Betonisasi akses jalan produksi tani sepanjang 1.2 KM dan normalisasi saluran irigasi tersier untuk 45 hektar sawah warga.",
    defaultBudget: 150_000_000,
    targetDusun: "Dusun 2 & Dusun 3",
    primaryPillarId: 4, // Infrastruktur
    primaryDelta: 18,
    primaryRationale: "Konektivitas jalan produksi memangkas waktu tempuh angkut hasil panen dan menjamin pasokan air sawah.",
    rippleEffects: [
      {
        pillarId: 3, // Ekonomi
        pillarName: "Ekonomi",
        delta: 11,
        rationale: "Biaya logistik angkut gabah turun hingga 35%, memicu peningkatan margin keuntungan petani lokal.",
      },
      {
        pillarId: 1, // Kesehatan
        pillarName: "Kesehatan",
        delta: 6,
        rationale: "Akses evakuasi medis dan ambulans desa ke dusun pelosok menjadi jauh lebih cepat.",
      },
      {
        pillarId: 6, // Lingkungan
        pillarName: "Lingkungan",
        delta: 4,
        rationale: "Drainase irigasi teratur mencegah genangan air liar dan erosi tanah di sekitar pemukiman.",
      },
    ],
    causalSummary: "Intervensi infrastruktur jalan tani membuka isolasi sentra pangan desa, yang secara langsung mengungkit efisiensi ekonomi perdagangan warga serta mempercepat akses layanan kesehatan dasar.",
    recommendations: [
      "Bentuk Tim Pemelihara Jalan Desa (TPJD) swadaya masyarakat agar umur pakai aspal/beton bertahan lebih dari 5 tahun.",
      "Integrasikan titik jalan baru dengan rute pengumpulan gabah BUMDes.",
    ],
  },
  {
    id: "preset-stunting-posyandu",
    title: "Revitalisasi Posyandu, Sanitasi Jamban Sehat & PMT Balita",
    categoryName: "Kesehatan & Gizi",
    description: "Pengadaan alat ukur antropometri terstandar di 6 Posyandu, bantuan 25 jamban keluarga sehat, dan program Pemberian Makanan Tambahan (PMT) rutin.",
    defaultBudget: 85_000_000,
    targetDusun: "Semua Dusun (Prioritas Dusun Rawan)",
    primaryPillarId: 1, // Kesehatan
    primaryDelta: 22,
    primaryRationale: "Eliminasi buang air besar sembarangan (ODF) dan pemenuhan gizi protein hewani 1.000 HPK balita desa.",
    rippleEffects: [
      {
        pillarId: 2, // Pendidikan
        pillarName: "Pendidikan",
        delta: 12,
        rationale: "Anak usia dini bebas stunting memiliki kemampuan kognitif dan tingkat kehadiran PAUD/SD yang lebih tinggi.",
      },
      {
        pillarId: 7, // Sosial
        pillarName: "Sosial",
        delta: 8,
        rationale: "Penguatan gotong royong kader Posyandu dan edukasi parenting keluarga muda di desa.",
      },
      {
        pillarId: 3, // Ekonomi
        pillarName: "Ekonomi",
        delta: 5,
        rationale: "Pengurangan pengeluaran biaya berobat keluarga pra-sejahtera untuk penyakit diare dan infeksi.",
      },
    ],
    causalSummary: "Investasi gizi dan sanitasi memicu lonjakan kualitas modal manusia (SDM) desa, menurunkan beban belanja kesehatan rumah tangga, dan mendongkrak capaian belajar anak sekolah.",
    recommendations: [
      "Libatkan bidan desa dan kader PKK dalam pencatatan digital tumbuh kembang balita setiap bulan.",
      "Prioritaskan bahan makanan PMT lokal seperti telur, ikan lele, dan sayur hasil kebun warga desa.",
    ],
  },
  {
    id: "preset-bumdes-umkm",
    title: "Pemberdayaan Modal BUMDes Sentra Olahan Kopi & Bantuan Alat",
    categoryName: "Ekonomi & Kewirausahaan",
    description: "Penyertaan modal BUMDes untuk pembelian mesin roasting kopi, sertifikasi halal/PIRT produk UMKM, dan permodalan bergulir bagi 30 pedagang.",
    defaultBudget: 130_000_000,
    targetDusun: "Dusun 1 (Sentra Niaga)",
    primaryPillarId: 3, // Ekonomi
    primaryDelta: 20,
    primaryRationale: "Hilirisasi produk perkebunan desa melipatgandakan nilai jual kopi dari biji mentah menjadi kopi kemasan siap seduh.",
    rippleEffects: [
      {
        pillarId: 7, // Sosial
        pillarName: "Sosial",
        delta: 10,
        rationale: "Menyerap 25 tenaga kerja pemuda desa yang sebelumnya menganggur atau bekerja serabutan.",
      },
      {
        pillarId: 8, // Tata Kelola
        pillarName: "Tata Kelola",
        delta: 7,
        rationale: "Meningkatkan Pendapatan Asli Desa (PADes) sebesar estimasi Rp 35 Juta per tahun melalui bagi hasil BUMDes.",
      },
      {
        pillarId: 1, // Kesehatan
        pillarName: "Kesehatan",
        delta: 5,
        rationale: "Peningkatan pendapatan kepala keluarga menaikkan alokasi anggaran belanja makanan bergizi rumah tangga.",
      },
    ],
    causalSummary: "Hilirisasi komoditas unggulan melalui BUMDes menciptakan efek pengganda ekonomi (multiplier effect) lokal, memperluas lapangan kerja kaum muda, dan memperkuat kemandirian fiskal desa.",
    recommendations: [
      "Terapkan audit keuangan berkala dan laporan pembukuan digital terbuka bagi BUMDes.",
      "Gunakan kanal pemasaran marketplace digital dan gerai oleh-oleh wisata daerah.",
    ],
  },
  {
    id: "preset-mitigasi-longsor",
    title: "Mitigasi Lereng Longsor, Bronjong Sungai & Pembentukan Destana",
    categoryName: "Ketahanan Bencana & Lingkungan",
    description: "Pemasangan bronjong kawat di 3 titik tebing rawan longsor, penanaman 2.000 bibit rumput vetiver & pohon aren, serta pelatihan Relawan Desa Tanggap Bencana (Destana).",
    defaultBudget: 95_000_000,
    targetDusun: "Dusun 4 (Kawasan Lereng)",
    primaryPillarId: 5, // Ketahanan Bencana
    primaryDelta: 24,
    primaryRationale: "Stabilisasi lereng curam dan kesiapan sistem peringatan dini (EWS) menghadapi curah hujan ekstrem.",
    rippleEffects: [
      {
        pillarId: 4, // Infrastruktur
        pillarName: "Infrastruktur",
        delta: 9,
        rationale: "Mencegah putusnya jembatan penghubung dan badan jalan desa utama akibat tertimbun material longsor.",
      },
      {
        pillarId: 6, // Lingkungan
        pillarName: "Lingkungan",
        delta: 8,
        rationale: "Rehabilitasi sabuk hijau lereng meningkatkan daya serap air tanah dan menahan sedimentasi sungai.",
      },
      {
        pillarId: 7, // Sosial
        pillarName: "Sosial",
        delta: 6,
        rationale: "Meningkatkan rasa aman warga dan soliditas posko relawan tanggap bencana tingkat RW.",
      },
    ],
    causalSummary: "Penguatan mitigasi bencana melindungi aset infrastruktur vital desa dari kehancuran mendadak serta memulihkan tutupan ekologi lereng secara berkelanjutan.",
    recommendations: [
      "Lakukan simulasi evakuasi jalur darurat bersama warga RW 04 setiap awal musim hujan.",
      "Pasang rambu jalur evakuasi dan titik kumpul yang jelas di seluruh dusun lereng.",
    ],
  },
  {
    id: "preset-digital-desa",
    title: "Digitalisasi Layanan Desa, Pojok Pintar & Internet Dusun",
    categoryName: "Tata Kelola & Pendidikan",
    description: "Pemasangan 4 titik hotspot WiFi publik gratis di balai dusun, anjungan surat digital mandiri, dan pengadaan 6 unit tablet untuk pojok baca anak.",
    defaultBudget: 70_000_000,
    targetDusun: "Seluruh Dusun",
    primaryPillarId: 8, // Tata Kelola
    primaryDelta: 19,
    primaryRationale: "Pelayanan administrasi kependudukan menjadi cepat, transparan, dan dapat diakses mandiri oleh warga.",
    rippleEffects: [
      {
        pillarId: 2, // Pendidikan
        pillarName: "Pendidikan",
        delta: 13,
        rationale: "Pelajar di dusun terluar kini memiliki akses internet berkecepatan tinggi untuk materi belajar daring dan literasi.",
      },
      {
        pillarId: 3, // Ekonomi
        pillarName: "Ekonomi",
        delta: 8,
        rationale: "Pelaku UMKM dan petani dapat memantau harga komoditas pasar secara real-time dan berpromosi online.",
      },
      {
        pillarId: 7, // Sosial
        pillarName: "Sosial",
        delta: 7,
        rationale: "Kanal penyampaian suara warga dan pengumuman kegiatan desa tersampaikan merata lewat grup informasi warga.",
      },
    ],
    causalSummary: "Infrastruktur digital memangkas birokrasi pemerintahan desa, membuka gerbang literasi bagi pelajar, serta menghubungkan pedagang lokal dengan pasar yang lebih luas.",
    recommendations: [
      "Adakan pelatihan literasi digital dasar dan keamanan internet untuk perangkat desa dan ibu-ibu PKK.",
      "Pasang filter pemblokir konten negatif pada jaringan WiFi publik desa.",
    ],
  },
  {
    id: "preset-bank-sampah",
    title: "Pembangunan TPS 3R, Budidaya Maggot & Bank Sampah Mandiri",
    categoryName: "Lingkungan & Ekonomi Sirkular",
    description: "Pembangunan hanggar pemilahan sampah TPS 3R, mesin pencacah organik, fasilitas biokonversi maggot BSF, dan pembentukan unit tabungan sampah warga.",
    defaultBudget: 65_000_000,
    targetDusun: "Dusun 1 & Dusun 2",
    primaryPillarId: 6, // Lingkungan
    primaryDelta: 21,
    primaryRationale: "Mengurangi 70% volume timbunan sampah yang dibuang ke sungai atau dibakar secara liar di pekarangan.",
    rippleEffects: [
      {
        pillarId: 1, // Kesehatan
        pillarName: "Kesehatan",
        delta: 10,
        rationale: "Sanitasi lingkungan membaik drastis, menurunkan sarang nyamuk DBD dan populasi lalat pembawa kuman.",
      },
      {
        pillarId: 3, // Ekonomi
        pillarName: "Ekonomi",
        delta: 7,
        rationale: "Hasil panen maggot dijual sebagai pakan ternak unggas/ikan lele, serta pupuk organik bernilai ekonomis.",
      },
      {
        pillarId: 5, // Ketahanan Bencana
        pillarName: "Ketahanan Bencana",
        delta: 6,
        rationale: "Saluran selokan dan gorong-gorong desa bebas dari sumbatan plastik saat hujan lebat.",
      },
    ],
    causalSummary: "Pengelolaan limbah sirkular tidak hanya menyehatkan ekologi desa, tetapi juga menghasilkan produk bernilai jual dan mencegah bencana genangan banjir.",
    recommendations: [
      "Terapkan sistem insentif tabungan sampah yang dapat ditukar dengan sembako atau pembayaran iuran listrik.",
      "Gunakan pupuk kompos hasil olahan untuk taman obat keluarga (TOGA) dan kebun gizi desa.",
    ],
  },
];

/**
 * AI Causal Inference Algorithm
 * Analyzes natural language input & budget to map primary impacts and ripple domino effects
 */
export function simulatePolicyImpact(
  programTitle: string,
  budget: number,
  targetDusun: string = "Dusun Terpilih",
  baselineScores: number[]
): CausalSimulationResult {
  const text = programTitle.toLowerCase();
  
  // 1. Identify primary pillar based on rich keyword semantics
  let primaryPillarId = 4; // Default: Infrastruktur
  let primaryRationale = "Pengembangan sarana fisik dan utilitas desa.";

  if (/(jalan|jembatan|irigasi|aspal|paving|air bersih|pipa|listrik|lampu|penerangan|drainase|gorong|dermaga|transportasi)/i.test(text)) {
    primaryPillarId = 4; // Infrastruktur
    primaryRationale = "Peningkatan aksesibilitas fisik dan ketersediaan sarana prasarana vital.";
  } else if (/(posyandu|gizi|stunting|puskesmas|sanitasi|jamban|ambulans|imunisasi|sehat|obat|balita|ibu hamil|tbc|pustu)/i.test(text)) {
    primaryPillarId = 1; // Kesehatan
    primaryRationale = "Perbaikan indikator kesehatan dasar, pencegahan gagal tumbuh (stunting), dan sanitasi keluarga.";
  } else if (/(sekolah|beasiswa|kursus|literasi|perpustakaan|paud|komputer|belajar|guru|madrasah|sdm|pelatihan pemuda)/i.test(text)) {
    primaryPillarId = 2; // Pendidikan
    primaryRationale = "Peningkatan akses edukasi, keterampilan kerja, dan fasilitas belajar generasi muda desa.";
  } else if (/(bumdes|modal|umkm|tani|pasar|ternak|koperasi|panen|kopi|wirausaha|pelatihan kerja|bantuan usaha|permodalan|wisata)/i.test(text)) {
    primaryPillarId = 3; // Ekonomi
    primaryRationale = "Stimulasi produktivitas usaha rakyat, diversifikasi pendapatan warga, dan penguatan permodalan desa.";
  } else if (/(longsor|banjir|bencana|destana|evakuasi|bronjong|early warning|relawan|tangguh|kebakaran|tanggap darurat)/i.test(text)) {
    primaryPillarId = 5; // Ketahanan Bencana
    primaryRationale = "Penguatan infrastruktur mitigasi fisik dan kesiapsiagaan tanggap darurat warga di titik rawan bencana.";
  } else if (/(sampah|tps|reboisasi|pohon|sungai|hutan|limbah|maggot|kompos|lingkungan|taman|penghijauan|konservasi)/i.test(text)) {
    primaryPillarId = 6; // Lingkungan
    primaryRationale = "Pemulihan daya dukung ekosistem, pengelolaan sampah sirkular, dan pelestarian sumber mata air.";
  } else if (/(pkk|karang taruna|kerukunan|lansia|disabilitas|bansos|gotong royong|sosial|kesetaraan|pemuda|olahraga)/i.test(text)) {
    primaryPillarId = 7; // Sosial
    primaryRationale = "Penguatan kohesi sosial, jaring pengaman keluarga rentan, dan keharmonisan bermasyarakat.";
  } else if (/(digital|pelayanan|aplikasi|transparansi|apbdes|musdes|aparatur|balai desa|perdes|website|informasi publik)/i.test(text)) {
    primaryPillarId = 8; // Tata Kelola
    primaryRationale = "Modernisasi akuntabilitas birokrasi desa dan kemudahan akses layanan administrasi publik.";
  }

  // 2. Calculate budget multiplier (Diminishing return curve, baseline 100 Juta)
  const budgetInMillion = Math.max(10, budget / 1_000_000);
  const budgetFactor = Math.min(1.5, Math.max(0.6, Math.log10(budgetInMillion) / 2)); // ~0.7 to 1.35
  
  const basePrimaryDelta = Math.round(18 * budgetFactor);
  const primaryDelta = Math.min(28, Math.max(10, basePrimaryDelta));

  // 3. Determine specific Causal Ripple Effects based on primary pillar
  let ripples: RippleEffect[] = [];
  let causalSummary = "";
  let recommendations: string[] = [];

  switch (primaryPillarId) {
    case 1: // Kesehatan -> Pendidikan, Sosial, Ekonomi
      ripples = [
        {
          pillarId: 2,
          pillarName: "Pendidikan",
          delta: Math.round(primaryDelta * 0.55),
          rationale: "Status gizi yang baik dan bebas cacingan meningkatkan konsentrasi serta kehadiran siswa di sekolah.",
        },
        {
          pillarId: 7,
          pillarName: "Sosial",
          delta: Math.round(primaryDelta * 0.38),
          rationale: "Keterlibatan kader kesehatan menguatkan solidaritas dan kepedulian antar-keluarga di tingkat RT.",
        },
        {
          pillarId: 3,
          pillarName: "Ekonomi",
          delta: Math.round(primaryDelta * 0.28),
          rationale: "Keluarga terbebas dari jerat biaya pengobatan darurat dan memiliki tabungan untuk modal kerja.",
        },
      ];
      causalSummary = `Investasi pada sektor Kesehatan memicu perbaikan kualitas kognitif anak (Pendidikan) dan menekan pengeluaran kesehatan rumah tangga pra-sejahtera (Ekonomi).`;
      recommendations = [
        "Pastikan pasokan makanan bergizi memanfaatkan hasil budidaya petani dan peternak lokal desa.",
        "Integrasikan data pemantauan posyandu ke dalam sistem informasi desa agar data stunting terpantau berkala.",
      ];
      break;

    case 2: // Pendidikan -> Ekonomi, Tata Kelola, Sosial
      ripples = [
        {
          pillarId: 3,
          pillarName: "Ekonomi",
          delta: Math.round(primaryDelta * 0.6),
          rationale: "Keterampilan vokasi dan literasi digital membuka peluang kerja baru dan wirausaha mandiri pemuda.",
        },
        {
          pillarId: 8,
          pillarName: "Tata Kelola",
          delta: Math.round(primaryDelta * 0.4),
          rationale: "Masyarakat yang teredukasi lebih aktif berpartisipasi dan memberikan masukan konstruktif dalam Musrenbangdes.",
        },
        {
          pillarId: 7,
          pillarName: "Sosial",
          delta: Math.round(primaryDelta * 0.35),
          rationale: "Peningkatan wawasan toleransi dan pencegahan pernikahan dini di kalangan remaja desa.",
        },
      ];
      causalSummary = `Peningkatan akses Pendidikan melahirkan generasi muda terampil yang memicu geliat wirausaha (Ekonomi) dan menaikkan kualitas partisipasi warga (Tata Kelola).`;
      recommendations = [
        "Sesuaikan kurikulum pelatihan vokasi dengan potensi komoditas unggulan desa.",
        "Sediakan fasilitas ruang belajar bersama dengan akses internet stabil di balai dusun.",
      ];
      break;

    case 3: // Ekonomi -> Sosial, Tata Kelola, Kesehatan
      ripples = [
        {
          pillarId: 7,
          pillarName: "Sosial",
          delta: Math.round(primaryDelta * 0.52),
          rationale: "Penurunan angka pengangguran menekan angka kriminalitas dan memupuk keharmonisan sosial.",
        },
        {
          pillarId: 8,
          pillarName: "Tata Kelola",
          delta: Math.round(primaryDelta * 0.38),
          rationale: "Kenaikan laba usaha desa menyumbang dividen Pendapatan Asli Desa (PADes) untuk kas pembangunan mandiri.",
        },
        {
          pillarId: 1,
          pillarName: "Kesehatan",
          delta: Math.round(primaryDelta * 0.3),
          rationale: "Keluarga memiliki kemampuan finansial lebih untuk membeli makanan sehat dan sanitasi mandiri.",
        },
      ];
      causalSummary = `Penguatan sendi Ekonomi desa berdampak langsung pada penyerapan tenaga kerja (Sosial) serta memperkuat kemandirian fiskal APBDes (Tata Kelola).`;
      recommendations = [
        "Wajibkan BUMDes menyusun laporan pertanggungjawaban terbuka setiap semester kepada BPD dan warga.",
        "Bangun kemitraan dengan off-taker pasar regional untuk menjamin kepastian harga panen petani.",
      ];
      break;

    case 4: // Infrastruktur -> Ekonomi, Kesehatan, Pendidikan
      ripples = [
        {
          pillarId: 3,
          pillarName: "Ekonomi",
          delta: Math.round(primaryDelta * 0.62),
          rationale: "Penurunan biaya transportasi dan lancarnya arus distribusi hasil bumi ke pasar kecamatan.",
        },
        {
          pillarId: 1,
          pillarName: "Kesehatan",
          delta: Math.round(primaryDelta * 0.36),
          rationale: "Waktu tempuh ambulans desa dan rujukan ibu melahirkan ke fasilitas kesehatan berkurang drastis.",
        },
        {
          pillarId: 2,
          pillarName: "Pendidikan",
          delta: Math.round(primaryDelta * 0.3),
          rationale: "Anak-anak sekolah di dusun pelosok dapat bersepeda atau berjalan kaki dengan aman dan nyaman.",
        },
      ];
      causalSummary = `Pembangunan Infrastruktur memecah isolasi geografis, memperlancar rantai pasok niaga (Ekonomi), dan mempermudah akses darurat medis (Kesehatan).`;
      recommendations = [
        "Prioritaskan penggunaan material lokal dan skema Padat Karya Tunai Desa (PKTD) untuk memberdayakan warga sekitar.",
        "Lengkapi jalan tani dengan saluran pembuangan air agar terhindar dari kerusakan dini saat musim hujan.",
      ];
      break;

    case 5: // Bencana -> Infrastruktur, Lingkungan, Sosial
      ripples = [
        {
          pillarId: 4,
          pillarName: "Infrastruktur",
          delta: Math.round(primaryDelta * 0.45),
          rationale: "Struktur fisik jalan, talud, dan jembatan terlindungi dari ancaman longsor dan amblas.",
        },
        {
          pillarId: 6,
          pillarName: "Lingkungan",
          delta: Math.round(primaryDelta * 0.4),
          rationale: "Penanaman tanaman penguat lereng mengembalikan tutupan kanopi hijau dan fungsi resapan air.",
        },
        {
          pillarId: 7,
          pillarName: "Sosial",
          delta: Math.round(primaryDelta * 0.3),
          rationale: "Kesiapsiagaan posko relawan menumbuhkan rasa aman dan kebersamaan warga saat situasi darurat.",
        },
      ];
      causalSummary = `Mitigasi Kebencanaan menyelamatkan aset-aset fisik desa (Infrastruktur) sekaligus memulihkan konservasi lahan perbukitan (Lingkungan).`;
      recommendations = [
        "Bentuk forum relawan desa siaga bencana dengan pelatihan P3K dan pemetaan jalur evakuasi.",
        "Larang keras alih fungsi lahan lereng curam menjadi pemukiman tanpa rekayasa talud teknis.",
      ];
      break;

    case 6: // Lingkungan -> Kesehatan, Ekonomi, Bencana
      ripples = [
        {
          pillarId: 1,
          pillarName: "Kesehatan",
          delta: Math.round(primaryDelta * 0.5),
          rationale: "Lingkungan yang bersih dan sumber air yang bebas polusi menekan wabah penyakit menular.",
        },
        {
          pillarId: 3,
          pillarName: "Ekonomi",
          delta: Math.round(primaryDelta * 0.38),
          rationale: "Nilai ekonomi dari pengolahan kompos, daur ulang sampah, dan daya tarik ekowisata desa.",
        },
        {
          pillarId: 5,
          pillarName: "Ketahanan Bencana",
          delta: Math.round(primaryDelta * 0.32),
          rationale: "Kelancaran aliran sungai dan tutupan hijau mencegah banjir luapan dan erosi tanggul.",
        },
      ];
      causalSummary = `Kelestarian Lingkungan menjamin kualitas kesehatan warga terbebas dari wabah penyakit serta membuka ceruk ekonomi baru melalui pengelolaan sirkular.`;
      recommendations = [
        "Bina kelompok bank sampah dusun dengan integrasi tabungan sembako.",
        "Terbitkan Perdes perlindungan sempadan mata air dan larangan buang sampah di sungai.",
      ];
      break;

    case 7: // Sosial -> Tata Kelola, Ekonomi, Pendidikan
      ripples = [
        {
          pillarId: 8,
          pillarName: "Tata Kelola",
          delta: Math.round(primaryDelta * 0.45),
          rationale: "Keterbukaan sosial mempermudah musyawarah mufakat dan mencegah konflik horizontal di desa.",
        },
        {
          pillarId: 3,
          pillarName: "Ekonomi",
          delta: Math.round(primaryDelta * 0.35),
          rationale: "Gotong royong dan arisan produktif memperkuat modal sosial bagi usaha kelompok tani.",
        },
        {
          pillarId: 2,
          pillarName: "Pendidikan",
          delta: Math.round(primaryDelta * 0.3),
          rationale: "Dukungan orang tua dan komunitas dalam pendampingan belajar anak di luar jam sekolah.",
        },
      ];
      causalSummary = `Penguatan modal Sosial menjadi pondasi kerukunan musyawarah (Tata Kelola) dan memperkuat ketahanan ekonomi berbasis kekeluargaan.`;
      recommendations = [
        "Berikan ruang seluas-luasnya bagi kelompok perempuan dan difabel dalam penyusunan prioritas APBDes.",
        "Adakan kegiatan festival budaya atau olahraga desa secara rutin untuk merawat kerukunan.",
      ];
      break;

    case 8: // Tata Kelola -> Sosial, Ekonomi, Pendidikan
    default:
      ripples = [
        {
          pillarId: 7,
          pillarName: "Sosial",
          delta: Math.round(primaryDelta * 0.42),
          rationale: "Transparansi alokasi dana desa menumbuhkan kepercayaan penuh warga terhadap pemerintah desa.",
        },
        {
          pillarId: 3,
          pillarName: "Ekonomi",
          delta: Math.round(primaryDelta * 0.4),
          rationale: "Efisiensi pengadaan barang/jasa dan kemudahan perizinan mempercepat realisasi proyek produktif.",
        },
        {
          pillarId: 2,
          pillarName: "Pendidikan",
          delta: Math.round(primaryDelta * 0.3),
          rationale: "Penyaluran beasiswa dan bantuan sarana belajar menjadi tepat sasaran tanpa kebocoran anggaran.",
        },
      ];
      causalSummary = `Tata Kelola yang akuntabel dan transparan meningkatkan kepercayaan warga (Sosial) dan memaksimalkan efektivitas belanja modal usaha (Ekonomi).`;
      recommendations = [
        "Pasang papan infografis APBDes di depan balai desa dan unggah rinciannya di portal publik desa.",
        "Terapkan sistem transaksi nontunai (CMS Desa) untuk meminimalisir risiko penyimpangan anggaran.",
      ];
      break;
  }

  // 4. Construct overall 8-pillar deltas
  const allPillarsDelta = new Array(8).fill(0);
  allPillarsDelta[primaryPillarId - 1] = primaryDelta;
  ripples.forEach((r) => {
    allPillarsDelta[r.pillarId - 1] = r.delta;
  });

  // Calculate new simulated scores bounded within [0, 100]
  const simulatedScores = baselineScores.map((score, idx) => {
    const delta = allPillarsDelta[idx];
    return Math.min(100, Math.max(0, score + delta));
  });

  const oldOverallScore = Math.round(baselineScores.reduce((a, b) => a + b, 0) / baselineScores.length);
  const newOverallScore = Math.round(simulatedScores.reduce((a, b) => a + b, 0) / simulatedScores.length);
  const deltaOverallScore = newOverallScore - oldOverallScore;

  const primaryCategory = CATEGORIES.find((c) => c.id === primaryPillarId)!;
  const roi = (deltaOverallScore / (budget / 10_000_000)).toFixed(2);

  return {
    programTitle,
    budget,
    targetDusun,
    primaryPillar: {
      id: primaryPillarId,
      name: primaryCategory.label,
      delta: primaryDelta,
      rationale: primaryRationale,
    },
    rippleEffects: ripples,
    allPillarsDelta,
    simulatedScores,
    oldOverallScore,
    newOverallScore,
    deltaOverallScore,
    causalSummary,
    recommendations,
    roiMetric: `+${roi} Poin / Rp 10 Juta`,
  };
}
