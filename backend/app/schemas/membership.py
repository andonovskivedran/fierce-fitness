from pydantic import BaseModel, ConfigDict, field_validator

class MembershipPlanBase(BaseModel):
    name: str
    price: float
    features: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1 or len(v) > 100:
            raise ValueError("Plan name must be between 1 and 100 characters")
        return v

    @field_validator("price")
    @classmethod
    def validate_price(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Price cannot be negative")
        if v > 1000000:
            raise ValueError("Price is unreasonably high")
        return round(v, 2)

    @field_validator("features")
    @classmethod
    def validate_features(cls, v: str) -> str:
        if len(v) > 5000:
            raise ValueError("Features description is too long")
        return v

class MembershipPlanOut(MembershipPlanBase):
    id: int

    model_config = ConfigDict(from_attributes=True)