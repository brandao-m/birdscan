from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.found_bird import FoundBird
from app.schemas.found_bird import FoundBirdResponse

router = APIRouter(prefix='/found-birds', tags=['Found Birds'])


@router.get('/', response_model=list[FoundBirdResponse])
def list_found_birds(db: Session = Depends(get_db)):
    found_birds = db.query(FoundBird).all()
    return found_birds