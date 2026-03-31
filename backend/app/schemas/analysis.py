from datetime import datetime

from pydantic import BaseModel

class AnalysisCreate(BaseModel):
    user_id: int
    bird_id: int
    audio_path: str
    confidence: float
    alternatives: str | None = None


class AnalysisResponse(BaseModel):
    id: int
    user_id: int
    bird_id: int
    audio_path: str
    confidence: float
    alternatives: str | None = None
    created_at : datetime

    class Config:
        from_attributes = True