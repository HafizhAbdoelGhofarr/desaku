from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Report, Village, CitizenReport
from schemas import ReportResponse, CitizenReportCreate, CitizenReportResponse, CitizenReportUpdate

router = APIRouter(tags=["reports"])

@router.get("/villages/{id}/reports", response_model=List[ReportResponse])
def get_village_reports(id: int, db: Session = Depends(get_db)):
    village = db.query(Village).filter(Village.id == id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    return db.query(Report).filter(Report.village_id == id).all()

# Citizen Reports (Suara Warga) CRUD
@router.get("/reports", response_model=List[CitizenReportResponse])
def get_citizen_reports(
    village_id: Optional[int] = None,
    cat_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CitizenReport).order_by(CitizenReport.created_at.desc())
    if village_id:
        query = query.filter(CitizenReport.village_id == village_id)
    if cat_id:
        query = query.filter(CitizenReport.cat_id == cat_id)
    return query.all()

@router.post("/reports", response_model=CitizenReportResponse)
def create_citizen_report(
    data: CitizenReportCreate,
    db: Session = Depends(get_db)
):
    report = CitizenReport(
        village_id=data.village_id,
        village_name=data.village_name,
        kecamatan=data.kecamatan,
        cat_id=data.cat_id,
        title=data.title,
        description=data.description,
        location=data.location,
        author=data.author,
        status=data.status or "terkirim",
        upvotes=data.upvotes or 0,
        response_note=data.response_note
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.patch("/reports/{id}/upvote", response_model=CitizenReportResponse)
def upvote_citizen_report(id: int, db: Session = Depends(get_db)):
    report = db.query(CitizenReport).filter(CitizenReport.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")
    report.upvotes += 1
    db.commit()
    db.refresh(report)
    return report

@router.patch("/reports/{id}/respond", response_model=CitizenReportResponse)
def respond_citizen_report(
    id: int,
    data: CitizenReportUpdate,
    db: Session = Depends(get_db)
):
    report = db.query(CitizenReport).filter(CitizenReport.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")
    if data.status:
        report.status = data.status
    if data.response_note is not None:
        report.response_note = data.response_note
    db.commit()
    db.refresh(report)
    return report

@router.delete("/reports/{id}")
def delete_citizen_report(id: int, db: Session = Depends(get_db)):
    report = db.query(CitizenReport).filter(CitizenReport.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")
    db.delete(report)
    db.commit()
    return {"message": f"Laporan #{id} berhasil dihapus"}

