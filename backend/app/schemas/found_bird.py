from datetime import datetime

from pydantic import BaseModel

from app.schemas.bird import BirdSummary


class FoundBirdResponse(BaseModel):
    id: int
    user_id: int
    bird: BirdSummary
    first_seen_at: datetime
    last_seen_at: datetime
    times_found: int