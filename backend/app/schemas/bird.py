from datetime import datetime

from pydantic import BaseModel


class BirdBase(BaseModel):
    common_name: str
    scientific_name: str
    description: str | None = None
    habitat: str | None = None
    diet: str | None = None
    distribution: str | None = None
    curiosity: str | None = None
    image_url: str | None = None


class BirdCreate(BirdBase):
    pass


class BirdSummary(BaseModel):
    id: int
    common_name: str
    scientific_name: str
    image_url: str | None = None

    class Config:
        from_attributes = True


class BirdResponse(BirdBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True