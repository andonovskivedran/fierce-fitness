from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional

class ProgramBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    difficulty_level: str

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1 or len(v) > 300:
            raise ValueError("Title must be between 1 and 300 characters")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        if len(v) < 1 or len(v) > 10000:
            raise ValueError("Description must be between 1 and 10000 characters")
        return v

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) > 500:
                raise ValueError("URL is too long")
            if v and not v.startswith(("http://", "https://")):
                raise ValueError("URL must start with http:// or https://")
        return v

    @field_validator("difficulty_level")
    @classmethod
    def validate_difficulty(cls, v: str) -> str:
        v = v.strip()
        allowed = ["beginner", "intermediate", "advanced", "all levels"]
        if v.lower() not in allowed:
            raise ValueError(f"Difficulty must be one of: {', '.join(allowed)}")
        return v

class ProgramOut(ProgramBase):
    id: int

    model_config = ConfigDict(from_attributes=True)