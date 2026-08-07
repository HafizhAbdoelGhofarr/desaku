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
    periode: str

class IndicatorValueCreate(IndicatorValueBase):
    pass

class IndicatorValueResponse(IndicatorValueBase, OrmBase):
    id: int
    village_id: int
    status: StatusVerifikasiEnum
    submitted_by: int
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None
    created_at: datetime

class IndicatorValueVerify(BaseModel):
    status: StatusVerifikasiEnum

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
