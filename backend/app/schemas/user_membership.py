from pydantic import BaseModel, ConfigDict
from datetime import datetime


class UserMembershipOut(BaseModel):
    id: int
    user_id: int
    plan_id: int
    plan_name: str = ""
    plan_price: float = 0.0
    plan_features: str = ""
    start_date: datetime
    end_date: datetime | None = None
    is_active: bool
    status: str = "ACTIVE"

    model_config = ConfigDict(from_attributes=True)
