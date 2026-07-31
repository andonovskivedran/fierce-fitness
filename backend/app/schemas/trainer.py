from pydantic import BaseModel, ConfigDict
from typing import Optional

class TrainerBase(BaseModel):
    specialty: str
    bio: str
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    image_url: Optional[str] = None

class TrainerCreate(TrainerBase):
    user_id: int

class TrainerOut(TrainerBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)