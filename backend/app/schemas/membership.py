from pydantic import BaseModel, ConfigDict

class MembershipPlanBase(BaseModel):
    name: str
    price: float
    features: str

class MembershipPlanOut(MembershipPlanBase):
    id: int

    model_config = ConfigDict(from_attributes=True)