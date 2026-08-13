from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime

class AppointmentBase(BaseModel):
    start_time: datetime

    @field_validator("start_time")
    @classmethod
    def validate_start_time(cls, v: datetime) -> datetime:
        from datetime import timezone
        if v.tzinfo is None:
            if v < datetime.now():
                raise ValueError("Appointment time must be in the future")
        else:
            if v < datetime.now(timezone.utc):
                raise ValueError("Appointment time must be in the future")
        return v

class AppointmentCreate(AppointmentBase):
    trainer_id: int

    @field_validator("trainer_id")
    @classmethod
    def validate_trainer_id(cls, v: int) -> int:
        if v < 1:
            raise ValueError("Invalid trainer ID")
        return v

class AppointmentOut(AppointmentBase):
    id: int
    member_id: int
    trainer_id: int
    status: str

    model_config = ConfigDict(from_attributes=True)