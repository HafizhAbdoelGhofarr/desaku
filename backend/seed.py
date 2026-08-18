from database import engine, Base, SessionLocal
from models import Village, User, Indicator, IndicatorValue, Score, CitizenReport, RoleEnum, KategoriEnum, StatusVerifikasiEnum
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()

    # 1. Seed Indicators
    if db.query(Indicator).count() == 0:
        indicators = [
            Indicator(kategori=KategoriEnum.kesehatan, name="Jumlah Fasilitas Kesehatan", unit="Unit", description="Jumlah puskesmas, posyandu, dan klinik di desa", weight=1.5),
            Indicator(kategori=KategoriEnum.kesehatan, name="Jumlah Tenaga Medis", unit="Orang", description="Jumlah dokter dan bidan desa", weight=1.2),
            
            Indicator(kategori=KategoriEnum.pendidikan, name="Jumlah Sekolah Dasar", unit="Sekolah", description="Jumlah SD sederajat", weight=1.0),
            Indicator(kategori=KategoriEnum.pendidikan, name="Rasio Guru dan Murid", unit="Rasio", description="Rasio jumlah guru terhadap murid", weight=1.1),
            
            Indicator(kategori=KategoriEnum.ekonomi, name="Jumlah BUMDes Aktif", unit="Unit", description="Jumlah Badan Usaha Milik Desa yang aktif", weight=1.3),
            Indicator(kategori=KategoriEnum.ekonomi, name="Tingkat Pengangguran Terbuka", unit="Persen", description="Persentase penduduk usia produktif yang menganggur", weight=1.4),
            
            Indicator(kategori=KategoriEnum.infrastruktur_aksesibilitas, name="Panjang Jalan Beraspal", unit="Km", description="Total panjang jalan desa yang sudah diaspal", weight=1.2),
            Indicator(kategori=KategoriEnum.infrastruktur_aksesibilitas, name="Akses Internet", unit="Persen", description="Persentase area desa yang terjangkau sinyal internet 4G/5G", weight=1.0),
            
            Indicator(kategori=KategoriEnum.lingkungan, name="Sistem Pengelolaan Sampah", unit="Unit", description="Jumlah TPS atau bank sampah yang beroperasi", weight=1.1),
            Indicator(kategori=KategoriEnum.lingkungan, name="Ketersediaan Air Bersih", unit="Persen", description="Persentase rumah tangga yang memiliki akses air bersih", weight=1.5),
            
            Indicator(kategori=KategoriEnum.ketahanan_bencana, name="Posko Tanggap Bencana", unit="Unit", description="Jumlah posko dan jalur evakuasi bencana", weight=1.2),
            Indicator(kategori=KategoriEnum.ketahanan_bencana, name="Pelatihan Mitigasi Bencana", unit="Kali/Tahun", description="Frekuensi pelatihan mitigasi bencana per tahun", weight=1.0),
            
            Indicator(kategori=KategoriEnum.tata_kelola, name="Indeks Desa Membangun (IDM)", unit="Poin", description="Skor IDM desa tahun terakhir", weight=1.4),
            Indicator(kategori=KategoriEnum.tata_kelola, name="Partisipasi Masyarakat dalam Musrenbangdes", unit="Persen", description="Tingkat kehadiran warga dalam musyawarah perencanaan pembangunan desa", weight=1.1),
            
            Indicator(kategori=KategoriEnum.sosial, name="Jumlah Organisasi Pemuda/Karang Taruna", unit="Organisasi", description="Jumlah kelompok karang taruna atau pemuda yang aktif", weight=1.0),
            Indicator(kategori=KategoriEnum.sosial, name="Tingkat Kriminalitas", unit="Kasus/Tahun", description="Jumlah laporan kriminalitas per tahun", weight=1.5)
        ]
        db.add_all(indicators)
        db.commit()
        print(f"Berhasil menambahkan {len(indicators)} indikator.")

    # 2. Seed Villages
    if db.query(Village).count() == 0:
        villages_data = [
            Village(name="Desa Sukamaju", kecamatan="Cisarua", kabupaten="Bogor", provinsi="Jawa Barat", population=4850, latitude=-6.6852, longitude=106.9421),
            Village(name="Desa Mekarjaya", kecamatan="Cisarua", kabupaten="Bogor", provinsi="Jawa Barat", population=3920, latitude=-6.6710, longitude=106.9530),
            Village(name="Desa Tegalwaru", kecamatan="Ciampea", kabupaten="Bogor", provinsi="Jawa Barat", population=6100, latitude=-6.5780, longitude=106.7020),
            Village(name="Desa Cibodas", kecamatan="Cibodas", kabupaten="Bogor", provinsi="Jawa Barat", population=5400, latitude=-6.7420, longitude=107.0050),
            Village(name="Desa Bojonggenteng", kecamatan="Jasinga", kabupaten="Bogor", provinsi="Jawa Barat", population=3200, latitude=-6.4890, longitude=106.4520),
            Village(name="Desa Pasirmuncang", kecamatan="Caringin", kabupaten="Bogor", provinsi="Jawa Barat", population=4150, latitude=-6.7120, longitude=106.8450),
            Village(name="Desa Sukaresmi", kecamatan="Megamendung", kabupaten="Bogor", provinsi="Jawa Barat", population=5800, latitude=-6.6430, longitude=106.8920),
            Village(name="Desa Cikarawang", kecamatan="Dramaga", kabupaten="Bogor", provinsi="Jawa Barat", population=7200, latitude=-6.5620, longitude=106.7310),
            Village(name="Desa Babakan", kecamatan="Dramaga", kabupaten="Bogor", provinsi="Jawa Barat", population=8100, latitude=-6.5540, longitude=106.7450),
            Village(name="Desa Sukawening", kecamatan="Dramaga", kabupaten="Bogor", provinsi="Jawa Barat", population=4600, latitude=-6.5730, longitude=106.7200),
        ]
        db.add_all(villages_data)
        db.commit()
        print(f"Berhasil menambahkan {len(villages_data)} desa.")

    # 3. Seed Users
    if db.query(User).count() == 0:
        admin_user = User(
            username="admin",
            email="admin@kabupaten.go.id",
            role=RoleEnum.admin,
            hashed_password=pwd_context.hash("admin123")
        )
        desa_user = User(
            username="operator_sukamaju",
            email="operator@sukamaju.desa.id",
            role=RoleEnum.pengelola_desa,
            village_id=1,
            hashed_password=pwd_context.hash("desa123")
        )
        db.add_all([admin_user, desa_user])
        db.commit()
        print("Berhasil menambahkan default user: admin & operator desa.")

    # 4. Seed Indicator Submissions (populate for all villages if count < 10)
    if db.query(IndicatorValue).count() < 10:
        sample_values = [
            # Desa Sukamaju (village_id=1)
            IndicatorValue(village_id=1, indicator_id=1, nilai=12.0, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Telah diverifikasi sesuai data Dinkes Kab. Bogor.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=2, nilai=8.0, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Data tenaga medis tervalidasi IBI & IDI.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=3, nilai=4.0, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Sesuai data Dapodik Kemendikbud.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=4, nilai=18.5, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Rasio memadai standar nasional.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=5, nilai=3.0, periode="2026", status=StatusVerifikasiEnum.pending, catatan="Laporan keuangan BUMDes semester I sedang ditinjau.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=6, nilai=4.8, periode="2026", status=StatusVerifikasiEnum.pending, catatan="Data Sakernas desa dalam verifikasi.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=7, nilai=14.5, periode="2026", status=StatusVerifikasiEnum.pending, catatan="Menunggu pengecekan dokumen pembuktian lapangan.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=8, nilai=92.0, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Cakupan sinyal 4G terkonfirmasi Diskominfo.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=9, nilai=2.0, periode="2026", status=StatusVerifikasiEnum.rejected, catatan="Mohon lengkapi dokumen sertifikat TPS3R.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=10, nilai=88.5, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Sesuai uji laboratorium air bersih PAMDes.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=11, nilai=2.0, periode="2026", status=StatusVerifikasiEnum.pending, catatan="Menunggu survei lokasi jalur evakuasi.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=12, nilai=3.0, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Sesuai laporan BPBD Kabupaten.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=13, nilai=0.785, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Status Desa Maju berdasarkan IDM Kemendesa.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=14, nilai=82.0, periode="2026", status=StatusVerifikasiEnum.pending, catatan="Berita acara Musrenbangdes terlampir.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=15, nilai=4.0, periode="2026", status=StatusVerifikasiEnum.verified, catatan="SK Karang Taruna aktif.", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=16, nilai=1.0, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Kamtibmas aman terkendali (Babinsa/Bhabinkamtibmas).", submitted_name="Sari Wulandari (Kaur Kesra)", submitted_by=2),

            # Desa Mekarjaya (village_id=2)
            IndicatorValue(village_id=2, indicator_id=1, nilai=8.0, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Data posyandu lengkap.", submitted_name="Hendra Pratama (Sekdes)", submitted_by=2),
            IndicatorValue(village_id=2, indicator_id=5, nilai=2.0, periode="2026", status=StatusVerifikasiEnum.pending, catatan="Sedang audit pembukuan unit usaha simpan pinjam.", submitted_name="Hendra Pratama (Sekdes)", submitted_by=2),
            IndicatorValue(village_id=2, indicator_id=7, nilai=11.2, periode="2026", status=StatusVerifikasiEnum.pending, catatan="Pekerjaan rabat beton dusun 3 selesai.", submitted_name="Hendra Pratama (Sekdes)", submitted_by=2),
            IndicatorValue(village_id=2, indicator_id=9, nilai=3.0, periode="2026", status=StatusVerifikasiEnum.pending, catatan="Menunggu konfirmasi Dinas Lingkungan Hidup.", submitted_name="Hendra Pratama (Sekdes)", submitted_by=2),

            # Desa Tegalwaru (village_id=3)
            IndicatorValue(village_id=3, indicator_id=1, nilai=14.0, periode="2026", status=StatusVerifikasiEnum.verified, catatan="Puskesmas pembantu aktif beroperasi.", submitted_name="Asep Saepudin (Operator)", submitted_by=2),
            IndicatorValue(village_id=3, indicator_id=10, nilai=65.0, periode="2026", status=StatusVerifikasiEnum.pending, catatan="Perlu kelengkapan foto debit air pipanisasi sumur bor.", submitted_name="Asep Saepudin (Operator)", submitted_by=2),
        ]
        db.add_all(sample_values)
        db.commit()
        print(f"Berhasil menambahkan {len(sample_values)} data indikator sample.")

    # 5. Seed Citizen Reports if empty
    if db.query(CitizenReport).count() < 3:
        reports_data = [
            CitizenReport(
                village_id=1,
                village_name="Desa Sukamaju",
                kecamatan="Cisarua",
                cat_id=4,
                title="Jalan Rusak & Berlubang di RW 03 Menuju Sentra Sayur",
                description="Akses jalan utama dusun mengalami kerusakan parah pasca hujan deras. Petani kesulitan mengangkut hasil panen ke pasar induk Cisarua.",
                location="Jl. Babakan Dusun 2, RW 03",
                author="Warga RT 02",
                status="ditindaklanjuti",
                upvotes=24,
                response_note="Telah dimasukkan ke RKPDes perubahan 2026 untuk perbaikan rabat beton."
            ),
            CitizenReport(
                village_id=1,
                village_name="Desa Sukamaju",
                kecamatan="Cisarua",
                cat_id=1,
                title="Perlengkapan Posyandu Melati Kurang Memadai",
                description="Timbangan bayi dan alat ukur stunting di Posyandu Melati 3 perlu penggantian untuk akurasi data penimbangan bulanan.",
                location="Posyandu Melati 3, RW 01",
                author="Kader Posyandu",
                status="ditinjau",
                upvotes=18,
                response_note="Usulan pengadaan alat antropometri standar Kemenkes sedang diverifikasi Kaur Kesra."
            ),
            CitizenReport(
                village_id=2,
                village_name="Desa Mekarjaya",
                kecamatan="Cisarua",
                cat_id=5,
                title="Penumpukan Sampah di Dekat Sungai Ciliwung Hulu",
                description="Perlu penambahan TPS terpadu dan armada gerobak sampah agar warga tidak membuang sampah ke aliran sungai.",
                location="Bantaran Sungai RW 04",
                author="Komunitas Peduli Lingkungan",
                status="terkirim",
                upvotes=31,
                response_note=None
            )
        ]
        db.add_all(reports_data)
        db.commit()
        print(f"Berhasil menambahkan {len(reports_data)} laporan warga.")

    db.close()
    print("Database seeding selesai!")

if __name__ == "__main__":
    seed_data()

