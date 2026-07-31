from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Trainer(Base):
    __tablename__ = "trainers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specialty = Column(String)
    bio = Column(Text)
    instagram_url = Column(String, nullable=True)
    facebook_url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

    user = relationship("User", back_populates="trainer_profile")
    blog_posts = relationship("BlogPost", back_populates="author")
    appointments = relationship("Appointment", back_populates="trainer")
