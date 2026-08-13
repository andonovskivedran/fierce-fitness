from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional

class TrainerBase(BaseModel):
    specialty: str
    bio: str
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    image_url: Optional[str] = None

    @field_validator("specialty")
    @classmethod
    def validate_specialty(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1 or len(v) > 200:
            raise ValueError("Specialty must be between 1 and 200 characters")
        return v

    @field_validator("bio")
    @classmethod
    def validate_bio(cls, v: str) -> str:
        if len(v) > 5000:
            raise ValueError("Bio must be at most 5000 characters")
        return v

    @field_validator("instagram_url", "facebook_url", "image_url")
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) > 500:
                raise ValueError("URL is too long")
            if v and not v.startswith(("http://", "https://")):
                raise ValueError("URL must start with http:// or https://")
        return v

class TrainerCreate(TrainerBase):
    user_id: int

class TrainerOut(TrainerBase):
    id: int
    user_id: int
    first_name: str = ""
    last_name: str = ""

    model_config = ConfigDict(from_attributes=True)