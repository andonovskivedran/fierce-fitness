from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from enum import Enum
import re

class RoleEnum(str, Enum):
    guest = "guest"
    member = "member"
    trainer = "trainer"
    admin = "admin"

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1 or len(v) > 100:
            raise ValueError("Name must be between 1 and 100 characters")
        if not re.match(r"^[a-zA-ZÀ-ÿ\s'-]+$", v):
            raise ValueError("Name contains invalid characters")
        return v

class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if len(v) > 128:
            raise ValueError("Password must be at most 128 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        return v

class UserOut(UserBase):
    id: int
    role: RoleEnum
    is_active: bool

    model_config = ConfigDict(from_attributes=True)