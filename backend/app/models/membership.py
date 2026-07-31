from sqlalchemy import Column, Integer, String, Text, Float
from .base import Base

class MembershipPlan(Base):
    __tablename__ = "membership_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    price = Column(Float)
    features = Column(Text)
