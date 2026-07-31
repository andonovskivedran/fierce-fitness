from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .base import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("users.id"))
    trainer_id = Column(Integer, ForeignKey("trainers.id"))
    start_time = Column(DateTime, nullable=False)
    status = Column(String, default="scheduled")

    member = relationship("User", back_populates="appointments")
    trainer = relationship("Trainer", back_populates="appointments")