from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Village, Score, KategoriEnum, IndicatorValue
from schemas import VillageCreate, VillageResponse, ScoreResponse, VillageSummaryResponse
from routers.auth import require_role

router = APIRouter(prefix="/villages", tags=["villages"])

@router.get("", response_model=List[VillageResponse])
def get_villages(db: Session = Depends(get_db)):
    return db.query(Village).all()

@router.get("/summary", response_model=List[VillageSummaryResponse])
def get_villages_summary(db: Session = Depends(get_db)):
    villages = db.query(Village).all()
    results = []
    
    # Map for sorting scores correctly
    kategori_order = [
        KategoriEnum.kesehatan,
        KategoriEnum.pendidikan,
        KategoriEnum.ekonomi,
        KategoriEnum.infrastruktur_aksesibilitas,
        KategoriEnum.ketahanan_bencana,
        KategoriEnum.lingkungan,
        KategoriEnum.sosial,
        KategoriEnum.tata_kelola
    ]
    
    for v in villages:
        # Get latest scores for the village
        scores_db = db.query(Score).filter(Score.village_id == v.id).all()
        score_dict = {s.kategori: s.nilai for s in scores_db}
        
        # Build ordered scores array (default to 0 if not exist)
        scores = [score_dict.get(kat, 0.0) for kat in kategori_order]
        
        # Calculate overall score (average of the 8 categories)
        overall_score = sum(scores) / len(scores) if scores else 0.0
        
        # Determine data completion (count verified indicator values / total expected)
        # Assuming 48 total indicators (6 per category * 8 categories)
        verified_count = db.query(IndicatorValue).filter(
            IndicatorValue.village_id == v.id,
            IndicatorValue.status == "verified"
        ).count()
        data_completion = min(100, int((verified_count / 48.0) * 100)) if verified_count else 0
        
        results.append(
            VillageSummaryResponse(
                id=v.id,
                name=v.name,
                kecamatan=v.kecamatan,
                kabupaten=v.kabupaten,
                provinsi=v.provinsi,
                population=v.population,
                latitude=v.latitude,
                longitude=v.longitude,
                overallScore=int(overall_score),
                scores=scores,
                dataCompletion=data_completion,
                created_at=v.created_at
            )
        )
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