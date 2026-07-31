from pydantic import BaseModel, EmailStr, ConfigDict
from enum import Enum

class RoleEnum(str, Enum):
    guest = "guest"
    member = "member"
    trainer = "trainer"
    admin = "admin"

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    role: RoleEnum
    is_active: bool

    model_config = ConfigDict(from_attributes=True)