from sqlalchemy import (
    Column, Integer, String, Float, ForeignKey, DateTime, Enum, Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from database import Base


class RoleEnum(str, enum.Enum):
    admin = "admin"                # DPMD - akses semua desa, verifikasi data
    pengelola_desa = "pengelola_desa"  # Perangkat Desa - input data, terikat 1 desa


class KategoriEnum(str, enum.Enum):
    kesehatan = "kesehatan"
    pendidikan = "pendidikan"
    ekonomi = "ekonomi"
    infrastruktur_aksesibilitas = "infrastruktur_aksesibilitas"
    lingkungan = "lingkungan"
    ketahanan_bencana = "ketahanan_bencana"
    tata_kelola = "tata_kelola"
    sosial = "sosial"


class StatusVerifikasiEnum(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class Village(Base):
    __tablename__ = "villages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    kecamatan = Column(String(100), nullable=False)
    kabupaten = Column(String(100), nullable=False)
    provinsi = Column(String(100), nullable=False)
    population = Column(Integer, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("User", back_populates="village")
    scores = relationship("Score", back_populates="village")
    reports = relationship("Report", back_populates="village")
    indicator_values = relationship(
        "IndicatorValue", back_populates="village",
        foreign_keys="IndicatorValue.village_id"
    )


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)

    # nullable karena admin (DPMD) tidak terikat 1 desa tertentu
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    village = relationship("Village", back_populates="users")


class Indicator(Base):
    """Master data: daftar tetap indikator per kategori (seed data)."""
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    kategori = Column(Enum(KategoriEnum), nullable=False)
    name = Column(String(150), nullable=False)  
    unit = Column(String(50), nullable=True)     
    description = Column(Text, nullable=True)

    values = relationship("IndicatorValue", back_populates="indicator")


class IndicatorValue(Base):
    """Data aktual nilai tiap indikator, per desa, per periode.
    Setiap input oleh pengelola_desa berstatus 'pending' sampai
    diverifikasi oleh admin. Hanya data 'verified' yang dipakai
    untuk menghitung Score yang tampil di dashboard publik.
    """
    __tablename__ = "indicator_values"

    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    indicator_id = Column(Integer, ForeignKey("indicators.id"), nullable=False)
    nilai = Column(Float, nullable=False)
    periode = Column(String(20), nullable=False) 

    status = Column(Enum(StatusVerifikasiEnum), nullable=False,
                     default=StatusVerifikasiEnum.pending)
    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    village = relationship("Village", back_populates="indicator_values",
                            foreign_keys=[village_id])
    indicator = relationship("Indicator", back_populates="values")
    submitter = relationship("User", foreign_keys=[submitted_by])
    verifier = relationship("User", foreign_keys=[verified_by])


class Score(Base):
    """Skor per kategori, dihitung OTOMATIS dari rata-rata IndicatorValue
    yang berstatus 'verified' pada kategori & periode yang sama.
    Ini yang ditampilkan di dashboard publik (masyarakat).
    """
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    kategori = Column(Enum(KategoriEnum), nullable=False)
    nilai = Column(Float, nullable=False)    
    periode = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    village = relationship("Village", back_populates="scores")


class Report(Base):
    """Rekomendasi pembangunan (tampilan saja).
    Keputusan akhir tetap manual oleh admin/pengelola desa di luar sistem.
    """
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    ringkasan = Column(Text, nullable=False)
    rekomendasi = Column(Text, nullable=True)
    periode = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    village = relationship("Village", back_populates="reports")