from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from datetime import datetime
from typing import Optional

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1 or len(v) > 200:
            raise ValueError("Name must be between 1 and 200 characters")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) > 20:
                raise ValueError("Phone number is too long")
            if v and not v.replace(" ", "").replace("-", "").replace("+", "").replace("(", "").replace(")", "").isdigit():
                raise ValueError("Phone number contains invalid characters")
        return v

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1 or len(v) > 5000:
            raise ValueError("Message must be between 1 and 5000 characters")
        return v

class ContactMessageOut(ContactMessageCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)