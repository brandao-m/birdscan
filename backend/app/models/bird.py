from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.db.database import Base

class Bird(Base):
    __tablename__ = 'birds'

    id = Column(Integer, primary_key=True, index=True)
    common_name = Column(String, nullable=False, index=True)
    scientific_name = Column(String, nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    habitat = Column(Text, nullable=True)
    diet = Column(Text, nullable=True)
    distribution = Column(Text, nullable=True)
    curiosity = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())