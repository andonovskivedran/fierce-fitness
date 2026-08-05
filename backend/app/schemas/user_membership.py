from pydantic import BaseModel, ConfigDict
from datetime import datetime


class UserMembershipOut(BaseModel):
    id: int
    user_id: int
    plan_id: int
    start_date: datetime
    end_date: datetime | None = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
