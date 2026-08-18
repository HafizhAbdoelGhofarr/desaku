from sqlalchemy.orm import Session
from sqlalchemy import func
from models import IndicatorValue, Score, StatusVerifikasiEnum, KategoriEnum, Indicator

def calculate_and_update_score(db: Session, village_id: int, kategori: KategoriEnum, periode: str):
    # Query all verified indicator values for this village, category, and period
    verified_values = db.query(IndicatorValue, Indicator).join(Indicator).filter(
        IndicatorValue.village_id == village_id,
        Indicator.kategori == kategori,
        IndicatorValue.periode == periode,
        IndicatorValue.status == StatusVerifikasiEnum.verified
    ).all()

    total_weighted_value = 0.0
    total_weight = 0.0

    for val, ind in verified_values:
        total_weighted_value += val.nilai * ind.weight
        total_weight += ind.weight

    avg_nilai = 0.0
    if total_weight > 0:
        avg_nilai = total_weighted_value / total_weight

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
    
    total_weighted_value = 0.0
    total_weight = 0.0
    
    for ind in indicators:
        if ind.id in overrides:
            total_weighted_value += overrides[ind.id] * ind.weight
            total_weight += ind.weight
        else:
            # get the verified value for this indicator
            val = db.query(IndicatorValue).filter(
                IndicatorValue.village_id == village_id,
                IndicatorValue.indicator_id == ind.id,
                IndicatorValue.periode == periode,
                IndicatorValue.status == StatusVerifikasiEnum.verified
            ).first()
            if val:
                total_weighted_value += val.nilai * ind.weight
                total_weight += ind.weight
                
    if total_weight == 0:
        return 0.0
    
    return total_weighted_value / total_weight
