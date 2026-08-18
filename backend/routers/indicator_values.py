from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Indicator, IndicatorValue, StatusVerifikasiEnum, Village, User
from schemas import IndicatorResponse, IndicatorValueCreate, IndicatorValueResponse, IndicatorValueVerify, IndicatorValueUpdate
from routers.auth import get_current_user
from utils import calculate_and_update_score

router = APIRouter(tags=["indicator_values"])

def format_indicator_value_response(val: IndicatorValue) -> IndicatorValueResponse:
    res = IndicatorValueResponse(
        id=val.id,
        village_id=val.village_id,
        indicator_id=val.indicator_id,
        nilai=val.nilai,
        periode=val.periode,
        status=val.status,
        catatan=val.catatan,
        submitted_name=val.submitted_name or (val.submitter.username if val.submitter else "Operator Desa"),
        submitted_by=val.submitted_by,
        verified_by=val.verified_by,
        verified_at=val.verified_at,
        created_at=val.created_at,
        village_name=val.village.name if val.village else f"Desa #{val.village_id}",
        indicator_name=val.indicator.name if val.indicator else f"Indikator #{val.indicator_id}",
        kategori=val.indicator.kategori.value if (val.indicator and val.indicator.kategori) else "kesehatan",
        unit=val.indicator.unit if val.indicator else ""
    )
    return res

@router.get("/indicators", response_model=List[IndicatorResponse])
def get_indicators(db: Session = Depends(get_db)):
    return db.query(Indicator).order_by(Indicator.id).all()

@router.post("/indicator-values", response_model=IndicatorValueResponse)
def create_indicator_value(
    data: IndicatorValueCreate,
    db: Session = Depends(get_db)
):
    # Resolve village_id
    v_id = data.village_id or 1
    village = db.query(Village).filter(Village.id == v_id).first()
    if not village:
        # Fallback to first village if id doesn't match
        first_v = db.query(Village).first()
        v_id = first_v.id if first_v else 1

    # Check if indicator exists
    indicator = db.query(Indicator).filter(Indicator.id == data.indicator_id).first()
    if not indicator:
        # Fallback to first indicator
        first_ind = db.query(Indicator).first()
        data.indicator_id = first_ind.id if first_ind else 1

    db_val = IndicatorValue(
        village_id=v_id,
        indicator_id=data.indicator_id,
        nilai=data.nilai,
        periode=data.periode or "2026",
        status=StatusVerifikasiEnum.pending,
        catatan=data.catatan or "Menunggu verifikasi DPMD.",
        submitted_name=data.submitted_name or "Operator Desa",
        submitted_by=2 # Default seeded operator
    )
    db.add(db_val)
    db.commit()
    db.refresh(db_val)
    return format_indicator_value_response(db_val)

@router.get("/indicator-values", response_model=List[IndicatorValueResponse])
def get_indicator_values(
    status: Optional[StatusVerifikasiEnum] = None,
    village_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(IndicatorValue).order_by(IndicatorValue.created_at.desc())
    
    if village_id:
        query = query.filter(IndicatorValue.village_id == village_id)
        
    if status:
        query = query.filter(IndicatorValue.status == status)
        
    items = query.all()
    return [format_indicator_value_response(item) for item in items]

@router.get("/indicator-values/{id}", response_model=IndicatorValueResponse)
def get_indicator_value_by_id(id: int, db: Session = Depends(get_db)):
    val = db.query(IndicatorValue).filter(IndicatorValue.id == id).first()
    if not val:
        raise HTTPException(status_code=404, detail="Data indikator tidak ditemukan")
    return format_indicator_value_response(val)

@router.put("/indicator-values/{id}", response_model=IndicatorValueResponse)
@router.patch("/indicator-values/{id}", response_model=IndicatorValueResponse)
def update_indicator_value(
    id: int,
    data: IndicatorValueUpdate,
    db: Session = Depends(get_db)
):
    val = db.query(IndicatorValue).filter(IndicatorValue.id == id).first()
    if not val:
        raise HTTPException(status_code=404, detail="Data indikator tidak ditemukan")
    
    if data.nilai is not None:
        val.nilai = data.nilai
    if data.catatan is not None:
        val.catatan = data.catatan
    if data.periode is not None:
        val.periode = data.periode
        
    db.commit()
    db.refresh(val)
    return format_indicator_value_response(val)

@router.delete("/indicator-values/{id}")
def delete_indicator_value(id: int, db: Session = Depends(get_db)):
    val = db.query(IndicatorValue).filter(IndicatorValue.id == id).first()
    if not val:
        raise HTTPException(status_code=404, detail="Data indikator tidak ditemukan")
    
    db.delete(val)
    db.commit()
    return {"message": f"Data indikator #{id} berhasil dihapus", "id": id}

@router.patch("/indicator-values/{id}/verify", response_model=IndicatorValueResponse)
def verify_indicator_value(
    id: int,
    data: IndicatorValueVerify,
    db: Session = Depends(get_db)
):
    val = db.query(IndicatorValue).filter(IndicatorValue.id == id).first()
    if not val:
        raise HTTPException(status_code=404, detail="Data indikator tidak ditemukan")
    
    if val.status != StatusVerifikasiEnum.pending:
        raise HTTPException(status_code=400, detail="Data indikator ini sudah diverifikasi atau ditolak.")
    
    val.status = data.status
    if data.catatan:
        val.catatan = data.catatan
    elif data.status == StatusVerifikasiEnum.verified:
        val.catatan = "Data terverifikasi dan sesuai bukti lapangan."
    elif data.status == StatusVerifikasiEnum.rejected:
        val.catatan = "Data ditolak karena tidak sesuai berkas pendukung."

    val.verified_by = 1 # Admin DPMD
    val.verified_at = datetime.utcnow()
    db.commit()
    db.refresh(val)
    
    if data.status == StatusVerifikasiEnum.verified and val.indicator:
        calculate_and_update_score(
            db=db,
            village_id=val.village_id,
            kategori=val.indicator.kategori,
            periode=val.periode
        )
        
    return format_indicator_value_response(val)

