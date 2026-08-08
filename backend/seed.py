from database import engine, Base, SessionLocal
from models import Village, User, Indicator, IndicatorValue, Score, RoleEnum, KategoriEnum, StatusVerifikasiEnum
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()

    # 1. Seed Indicators
    if db.query(Indicator).count() == 0:
        indicators = [
            Indicator(kategori=KategoriEnum.kesehatan, name="Jumlah Fasilitas Kesehatan", unit="Unit", description="Jumlah puskesmas, posyandu, dan klinik di desa"),
            Indicator(kategori=KategoriEnum.kesehatan, name="Jumlah Tenaga Medis", unit="Orang", description="Jumlah dokter dan bidan desa"),
            
            Indicator(kategori=KategoriEnum.pendidikan, name="Jumlah Sekolah Dasar", unit="Sekolah", description="Jumlah SD sederajat"),
            Indicator(kategori=KategoriEnum.pendidikan, name="Rasio Guru dan Murid", unit="Rasio", description="Rasio jumlah guru terhadap murid"),
            
            Indicator(kategori=KategoriEnum.ekonomi, name="Jumlah BUMDes Aktif", unit="Unit", description="Jumlah Badan Usaha Milik Desa yang aktif"),
            Indicator(kategori=KategoriEnum.ekonomi, name="Tingkat Pengangguran Terbuka", unit="Persen", description="Persentase penduduk usia produktif yang menganggur"),
            
            Indicator(kategori=KategoriEnum.infrastruktur_aksesibilitas, name="Panjang Jalan Beraspal", unit="Km", description="Total panjang jalan desa yang sudah diaspal"),
            Indicator(kategori=KategoriEnum.infrastruktur_aksesibilitas, name="Akses Internet", unit="Persen", description="Persentase area desa yang terjangkau sinyal internet 4G/5G"),
            
            Indicator(kategori=KategoriEnum.lingkungan, name="Sistem Pengelolaan Sampah", unit="Unit", description="Jumlah TPS atau bank sampah yang beroperasi"),
            Indicator(kategori=KategoriEnum.lingkungan, name="Ketersediaan Air Bersih", unit="Persen", description="Persentase rumah tangga yang memiliki akses air bersih"),
            
            Indicator(kategori=KategoriEnum.ketahanan_bencana, name="Posko Tanggap Bencana", unit="Unit", description="Jumlah posko dan jalur evakuasi bencana"),
            Indicator(kategori=KategoriEnum.ketahanan_bencana, name="Pelatihan Mitigasi Bencana", unit="Kali/Tahun", description="Frekuensi pelatihan mitigasi bencana per tahun"),
            
            Indicator(kategori=KategoriEnum.tata_kelola, name="Indeks Desa Membangun (IDM)", unit="Poin", description="Skor IDM desa tahun terakhir"),
            Indicator(kategori=KategoriEnum.tata_kelola, name="Partisipasi Masyarakat dalam Musrenbangdes", unit="Persen", description="Tingkat kehadiran warga dalam musyawarah perencanaan pembangunan desa"),
            
            Indicator(kategori=KategoriEnum.sosial, name="Jumlah Organisasi Pemuda/Karang Taruna", unit="Organisasi", description="Jumlah kelompok karang taruna atau pemuda yang aktif"),
            Indicator(kategori=KategoriEnum.sosial, name="Tingkat Kriminalitas", unit="Kasus/Tahun", description="Jumlah laporan kriminalitas per tahun")
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
            email="admin@dpmd.go.id",
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

    # 4. Seed Pending Indicator Submissions for verification demo
    if db.query(IndicatorValue).count() == 0:
        sample_values = [
            IndicatorValue(village_id=1, indicator_id=1, nilai=12.0, periode="2026", status=StatusVerifikasiEnum.verified, submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=7, nilai=8.5, periode="2026", status=StatusVerifikasiEnum.pending, submitted_by=2),
            IndicatorValue(village_id=1, indicator_id=5, nilai=2.0, periode="2026", status=StatusVerifikasiEnum.pending, submitted_by=2),
            IndicatorValue(village_id=2, indicator_id=9, nilai=3.0, periode="2026", status=StatusVerifikasiEnum.pending, submitted_by=2),
            IndicatorValue(village_id=3, indicator_id=10, nilai=65.0, periode="2026", status=StatusVerifikasiEnum.pending, submitted_by=2),
        ]
        db.add_all(sample_values)
        db.commit()
        print(f"Berhasil menambahkan {len(sample_values)} data indikator sample.")

    db.close()
    print("Database seeding selesai!")

if __name__ == "__main__":
    seed_data()
