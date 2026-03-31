from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.bird import Bird
from app.models.found_bird import FoundBird
from app.schemas.bird import BirdSummary
from app.schemas.found_bird import FoundBirdResponse

router = APIRouter(prefix='/found-birds', tags=['Found Birds'])


@router.get('/', response_model=list[FoundBirdResponse])
def list_found_birds(db: Session = Depends(get_db)):
    found_birds = db.query(FoundBird).all()
    
    response = []

    for found_bird in found_birds:
        bird = db.query(Bird).filter(Bird.id == found_bird.bird_id).first()

        if not bird:
            continue

        response.append(
            FoundBirdResponse(
                id=found_bird.id,
                user_id=found_bird.user_id,
                bird=BirdSummary(
                    id=bird.id,
                    common_name=bird.common_name,
                    scientific_name=bird.scientific_name,
                    image_url=bird.image_url,
                ),
                first_seen_at=found_bird.first_seen_at,
                last_seen_at=found_bird.last_seen_at,
                times_found=found_bird.times_found,
            )
        )

    return response 