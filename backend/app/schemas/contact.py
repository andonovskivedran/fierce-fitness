from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ContactMessageOut(ContactMessageCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)