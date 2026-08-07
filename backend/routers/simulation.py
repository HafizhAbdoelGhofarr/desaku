from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import KategoriEnum, Score
from schemas import SimulationRequest, SimulationResponse, CategoryScoreComparison
from utils import get_simulated_score

router = APIRouter(tags=["simulation"])

@router.post("/simulate", response_model=SimulationResponse)
def simulate(req: SimulationRequest, db: Session = Depends(get_db)):
    overrides_dict = {o.indicator_id: o.nilai for o in req.overrides}
    
    comparisons = []
    
    for kat in KategoriEnum:
        # Get current score
        current = db.query(Score).filter(
            Score.village_id == req.village_id,
            Score.kategori == kat,
            Score.periode == req.periode
        ).first()
        
        current_score = current.nilai if current else None
        
        # Calculate simulated score
        projected_score = get_simulated_score(db, req.village_id, kat, req.periode, overrides_dict)
        
        comparisons.append(CategoryScoreComparison(
            kategori=kat,
            current_score=current_score,
            projected_score=projected_score
        ))
        
    return SimulationResponse(
        village_id=req.village_id,
        periode=req.periode,
        comparisons=comparisons
    )
