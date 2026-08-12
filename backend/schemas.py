from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from models import RoleEnum, KategoriEnum, StatusVerifikasiEnum

class OrmBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# Village
class VillageBase(BaseModel):
    name: str
    kecamatan: str
    kabupaten: str
    provinsi: str
    population: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class VillageCreate(VillageBase):
    pass

class VillageResponse(VillageBase, OrmBase):
    id: int
    created_at: datetime

class VillageDashboardResponse(VillageResponse):
    overallScore: float
    scores: List[float]
    dataCompletion: float

# User
class UserBase(BaseModel):
    username: str
    email: str
    role: RoleEnum
    village_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase, OrmBase):
    id: int
    created_at: datetime

class UserLogin(BaseModel):
    username: str
    password: str

# Indicator
class IndicatorResponse(OrmBase):
    id: int
    kategori: KategoriEnum
    name: str
    unit: Optional[str] = None
    description: Optional[str] = None

# IndicatorValue
class IndicatorValueBase(BaseModel):
    indicator_id: int
    nilai: float
    periode: str = "2026"
    village_id: Optional[int] = None
    submitted_name: Optional[str] = None
    catatan: Optional[str] = None

class IndicatorValueCreate(IndicatorValueBase):
    pass

class IndicatorValueUpdate(BaseModel):
    nilai: Optional[float] = None
    catatan: Optional[str] = None
    periode: Optional[str] = None

class IndicatorValueResponse(OrmBase):
    id: int
    village_id: int
    indicator_id: int
    nilai: float
    periode: str
    status: StatusVerifikasiEnum
    catatan: Optional[str] = None
    submitted_name: Optional[str] = None
    submitted_by: Optional[int] = None
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None
    created_at: datetime
    # Virtual / Joined fields for frontend ease
    village_name: Optional[str] = None
    indicator_name: Optional[str] = None
    kategori: Optional[str] = None
    unit: Optional[str] = None

class IndicatorValueVerify(BaseModel):
    status: StatusVerifikasiEnum
    catatan: Optional[str] = None

# CitizenReport (Suara Warga)
class CitizenReportBase(BaseModel):
    village_id: Optional[int] = None
    village_name: str
    kecamatan: str
    cat_id: int = 1
    title: str
    description: str
    location: str
    author: str
    status: str = "terkirim"
    upvotes: int = 0
    response_note: Optional[str] = None

class CitizenReportCreate(CitizenReportBase):
    pass

class CitizenReportUpdate(BaseModel):
    status: Optional[str] = None
    response_note: Optional[str] = None

class CitizenReportResponse(CitizenReportBase, OrmBase):
    id: int
    created_at: datetime

# Score
class ScoreResponse(OrmBase):
    id: int
    village_id: int
    kategori: KategoriEnum
    nilai: float
    periode: str
    created_at: datetime

# Report
class ReportResponse(OrmBase):
    id: int
    village_id: int
    ringkasan: str
    rekomendasi: Optional[str] = None
    periode: str
    created_at: datetime

# Simulation
class SimulatedIndicatorOverride(BaseModel):
    indicator_id: int
    nilai: float

class SimulationRequest(BaseModel):
    village_id: int
    periode: str
    overrides: List[SimulatedIndicatorOverride]

class CategoryScoreComparison(BaseModel):
    kategori: KategoriEnum
    current_score: Optional[float]
    projected_score: Optional[float]

class SimulationResponse(BaseModel):
    village_id: int
    periode: str
    comparisons: List[CategoryScoreComparison]
