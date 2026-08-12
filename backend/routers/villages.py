from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Village, Score
from schemas import VillageCreate, VillageResponse, ScoreResponse, VillageDashboardResponse
from routers.auth import require_role
from models import KategoriEnum


router = APIRouter(prefix="/villages", tags=["villages"])

@router.get("", response_model=List[VillageResponse])
def get_villages(db: Session = Depends(get_db)):
    return db.query(Village).all()

@router.get("/dashboard-stats", response_model=List[VillageDashboardResponse])
def get_dashboard_stats(db: Session = Depends(get_db)):
    villages = db.query(Village).all()
    results = []
    # KategoriEnum order matches frontend index order
    categories = [
        KategoriEnum.kesehatan,
        KategoriEnum.pendidikan,
        KategoriEnum.ekonomi,
        KategoriEnum.infrastruktur_aksesibilitas,
        KategoriEnum.ketahanan_bencana,
        KategoriEnum.lingkungan,
        KategoriEnum.sosial,
        KategoriEnum.tata_kelola
    ]

    for village in villages:
        scores_db = db.query(Score).filter(Score.village_id == village.id).all()
        score_dict = {s.kategori: s.nilai for s in scores_db}
        
        scores_array = []
        for cat in categories:
            scores_array.append(score_dict.get(cat, 0.0))
        
        overall_score = sum(scores_array) / len(scores_array) if scores_array else 0.0
        data_completion = len(score_dict) / len(categories) * 100

        res = VillageDashboardResponse(
            **village.__dict__,
            overallScore=round(overall_score),
            scores=[round(s) for s in scores_array],
            dataCompletion=round(data_completion)
        )
        results.append(res)
    
    return results

@router.get("/{id}", response_model=VillageResponse)
def get_village(id: int, db: Session = Depends(get_db)):
    village = db.query(Village).filter(Village.id == id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    return village

@router.get("/{id}/scores", response_model=List[ScoreResponse])
def get_village_scores(id: int, db: Session = Depends(get_db)):
    village = db.query(Village).filter(Village.id == id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    return db.query(Score).filter(Score.village_id == id).all()

@router.post("", response_model=VillageResponse)
def create_village(
    village: VillageCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin"]))
):
    db_village = Village(**village.model_dump())
    db.add(db_village)
    db.commit()
    db.refresh(db_village)
    return db_village