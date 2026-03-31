from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.bird import Bird
from app.schemas.bird import BirdCreate, BirdResponse

router = APIRouter(prefix='/birds', tags=['Birds'])

@router.post('/', response_model=BirdResponse, status_code=201)
def create_bird(bird_data: BirdCreate, db: Session = Depends(get_db)):
    existing_bird = (
        db.query(Bird)
        .filter(Bird.scientific_name == bird_data.scientific_name)
        .first()
    )

    if existing_bird:
        raise HTTPException(status_code=400, detail='Ave já cadastrada')
    
    new_bird = Bird(
        common_name=bird_data.common_name,
        scientific_name=bird_data.scientific_name,
        description=bird_data.description,
        habitat=bird_data.habitat,
        diet=bird_data.diet,
        distribution=bird_data.distribution,
        curiosity=bird_data.curiosity,
        image_url=bird_data.image_url,
    )

    db.add(new_bird)
    db.commit()
    db.refresh(new_bird)

    return new_bird


@router.get('/', response_model=list[BirdResponse])
def list_birds(db: Session = Depends(get_db)):
    birds = db.query(Bird).all()
    return birds