from sqlalchemy import Column, Integer, String, Text
from .base import Base

class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    image_url = Column(String, nullable=True)
    difficulty_level = Column(String)
