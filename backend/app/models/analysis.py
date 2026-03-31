from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.db.database import Base

class Analysis(Base):
    __tablename__ = 'analyses'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    bird_id = Column(Integer, ForeignKey('birds.id'), nullable=False)
    audio_path = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    alternatives = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())