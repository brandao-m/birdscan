from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.analysis import Analysis
from app.models.bird import Bird
from app.models.found_bird import FoundBird
from app.models.user import User
from app.schemas.analysis import AnalysisCreate, AnalysisResponse

router = APIRouter(prefix='/analyses', tags=['Analyses'])


@router.post('/', response_model=AnalysisResponse, status_code=201)
def create_analysis(analysis_data: AnalysisCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == analysis_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='Usuario não encontrado')
    
    bird = db.query(Bird).filter(Bird.id == analysis_data.bird_id).first()
    if not bird:
        raise HTTPException(status_code=404, detail='Ave não encontrada')
    
    new_analysis = Analysis(
        user_id=analysis_data.user_id,
        bird_id=analysis_data.bird_id,
        audio_path=analysis_data.audio_path,
        confidence=analysis_data.confidence,
        alternatives=analysis_data.alternatives,
    )

    db.add(new_analysis)

    existing_found_bird = (
        db.query(FoundBird)
        .filter(
            FoundBird.user_id == analysis_data.user_id,
            FoundBird.bird_id == analysis_data.bird_id,
        )
        .first()
    )

    if existing_found_bird:
        existing_found_bird.times_found += 1
        existing_found_bird.last_seen_at = datetime.now(timezone.utc)
    else: 
        new_found_bird = FoundBird(
            user_id=analysis_data.user_id,
            bird_id=analysis_data.bird_id,
        )
        db.add(new_found_bird)

    db.commit()
    db.refresh(new_analysis)

    return new_analysis


@router.get('/', response_model=list[AnalysisResponse])
def list_analyses(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).all()
    return analyses