from sqlalchemy.orm import Session
from sqlalchemy import func
from models import IndicatorValue, Score, StatusVerifikasiEnum, KategoriEnum, Indicator

def calculate_and_update_score(db: Session, village_id: int, kategori: KategoriEnum, periode: str):
    # Query all verified indicator values for this village, category, and period
    avg_nilai = db.query(func.avg(IndicatorValue.nilai)).join(Indicator).filter(
        IndicatorValue.village_id == village_id,
        Indicator.kategori == kategori,
        IndicatorValue.periode == periode,
        IndicatorValue.status == StatusVerifikasiEnum.verified
    ).scalar()

    if avg_nilai is None:
        avg_nilai = 0.0

    # Check if a score entry already exists
    score_entry = db.query(Score).filter(
        Score.village_id == village_id,
        Score.kategori == kategori,
        Score.periode == periode
    ).first()

    if score_entry:
        score_entry.nilai = avg_nilai
    else:
        score_entry = Score(
            village_id=village_id,
            kategori=kategori,
            nilai=avg_nilai,
            periode=periode
        )
        db.add(score_entry)
    
    db.commit()
    db.refresh(score_entry)
    return score_entry

def get_simulated_score(db: Session, village_id: int, kategori: KategoriEnum, periode: str, overrides: dict):
    """
    Calculates the simulated score without writing to the database.
    overrides: dict mapping indicator_id to simulated float value.
    """
    indicators = db.query(Indicator).filter(Indicator.kategori == kategori).all()
    
    if not indicators:
        return 0.0
    
    total_score = 0.0
    count = 0
    
    for ind in indicators:
        if ind.id in overrides:
            total_score += overrides[ind.id]
            count += 1
        else:
            # get the verified value for this indicator
            val = db.query(IndicatorValue).filter(
                IndicatorValue.village_id == village_id,
                IndicatorValue.indicator_id == ind.id,
                IndicatorValue.periode == periode,
                IndicatorValue.status == StatusVerifikasiEnum.verified
            ).first()
            if val:
                total_score += val.nilai
                count += 1
                
    if count == 0:
        return 0.0
    
    return total_score / count
