from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Indicator, IndicatorValue, StatusVerifikasiEnum
from schemas import IndicatorResponse, IndicatorValueCreate, IndicatorValueResponse, IndicatorValueVerify
from routers.auth import get_current_user, require_role
from utils import calculate_and_update_score

router = APIRouter(tags=["indicator_values"])

@router.get("/indicators", response_model=List[IndicatorResponse])
def get_indicators(db: Session = Depends(get_db)):
    return db.query(Indicator).all()

@router.post("/indicator-values", response_model=IndicatorValueResponse)
def create_indicator_value(
    data: IndicatorValueCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["pengelola_desa"]))
):
    if not current_user.village_id:
        raise HTTPException(status_code=400, detail="User is not assigned to any village")

    db_val = IndicatorValue(
        village_id=current_user.village_id,
        indicator_id=data.indicator_id,
        nilai=data.nilai,
        periode=data.periode,
        status=StatusVerifikasiEnum.pending,
        submitted_by=current_user.id
    )
    db.add(db_val)
    db.commit()
    db.refresh(db_val)
    return db_val

@router.get("/indicator-values", response_model=List[IndicatorValueResponse])
def get_indicator_values(
    status: Optional[StatusVerifikasiEnum] = None,
    village_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin"]))
):
    query = db.query(IndicatorValue)
    if status:
        query = query.filter(IndicatorValue.status == status)
    if village_id:
        query = query.filter(IndicatorValue.village_id == village_id)
    return query.all()

@router.patch("/indicator-values/{id}/verify", response_model=IndicatorValueResponse)
def verify_indicator_value(
    id: int,
    data: IndicatorValueVerify,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin"]))
):
    val = db.query(IndicatorValue).filter(IndicatorValue.id == id).first()
    if not val:
        raise HTTPException(status_code=404, detail="IndicatorValue not found")
    
    val.status = data.status
    val.verified_by = current_user.id
    val.verified_at = datetime.utcnow()
    db.commit()
    db.refresh(val)
    
    if data.status == StatusVerifikasiEnum.verified:
        calculate_and_update_score(
            db=db,
            village_id=val.village_id,
            kategori=val.indicator.kategori,
            periode=val.periode
        )
        
    return val
