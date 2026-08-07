from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Village, Score
from schemas import VillageCreate, VillageResponse, ScoreResponse
from routers.auth import require_role

router = APIRouter(prefix="/villages", tags=["villages"])

@router.get("", response_model=List[VillageResponse])
def get_villages(db: Session = Depends(get_db)):
    return db.query(Village).all()

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