from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.sql import func

from app.db.database import Base

class FoundBird(Base):
    __tablename__ = 'found_birds'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    bird_id = Column(Integer, ForeignKey('birds.id'), nullable=False)
    first_seen_at = Column(DateTime(timezone=True), server_default=func.now())
    last_seen_at = Column(DateTime(timezone=True), server_default=func.now())
    times_found = Column(Integer, nullable=False, default=1)