from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    category = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    trainer_id = Column(Integer, ForeignKey("trainers.id"))

    author = relationship("Trainer", back_populates="blog_posts")
