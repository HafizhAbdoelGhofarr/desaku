from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Report, Village
from schemas import ReportResponse

router = APIRouter(prefix="/villages", tags=["reports"])

@router.get("/{id}/reports", response_model=List[ReportResponse])
def get_village_reports(id: int, db: Session = Depends(get_db)):
    village = db.query(Village).filter(Village.id == id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    
    reports = db.query(Report).filter(Report.village_id == id).all()
    return reports
