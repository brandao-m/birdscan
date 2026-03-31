from datetime import datetime

from pydantic import BaseModel


class FoundBirdResponse(BaseModel):
    id: int
    user_id: int
    bird_id: int
    first_seen_at: datetime
    last_seen_at: datetime
    times_found: int

    class Config: 
        from_attributes = True