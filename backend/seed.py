from database import engine, Base, SessionLocal
from models import Indicator, KategoriEnum

# Ensure tables are created
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(Indicator).count() > 0:
        print("Data sudah ada, skip seeding.")
        db.close()
        return

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
    print(f"Berhasil menambahkan {len(indicators)} indikator dasar ke database.")
    
    db.close()

if __name__ == "__main__":
    seed_data()
