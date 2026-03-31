from pydantic import BaseModel

from app.schemas.bird import BirdSummary


class AnalysisUploadResponse(BaseModel):
    message: str
    filename: str
    file_path: str
    bird: BirdSummary
    confidence: float
    analysis_id: int