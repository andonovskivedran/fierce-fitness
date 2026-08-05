from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
import enum
from .base import Base

class RoleEnum(str, enum.Enum):
    guest = "guest"
    member = "member"
    trainer = "trainer"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.guest)
    is_active = Column(Boolean, default=True)

    trainer_profile = relationship("Trainer", back_populates="user", uselist=False)
    appointments = relationship("Appointment", back_populates="member")
    memberships = relationship("UserMembership", back_populates="user")