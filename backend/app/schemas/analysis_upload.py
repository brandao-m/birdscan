from pydantic import BaseModel


class AnalysisUploadBirdResponse(BaseModel):
    id: int
    common_name: str
    scientific_name: str
    description: str | None = None
    habitat: str | None = None
    diet: str | None = None
    distribution: str | None = None
    Curiosity: str | None = None
    image_url: str | None = None


class AnalysisUploadResponse(BaseModel):
    message: str
    filename: str
    file_path: str
    bird: AnalysisUploadBirdResponse
    confidence: float
    alternatives: str | None = None
    analysis_id: int