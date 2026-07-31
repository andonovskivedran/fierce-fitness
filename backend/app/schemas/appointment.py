from pydantic import BaseModel, ConfigDict
from datetime import datetime

class AppointmentBase(BaseModel):
    start_time: datetime

class AppointmentCreate(AppointmentBase):
    trainer_id: int

class AppointmentOut(AppointmentBase):
    id: int
    member_id: int
    trainer_id: int
    status: str

    model_config = ConfigDict(from_attributes=True)