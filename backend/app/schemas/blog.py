from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from typing import Optional

class BlogPostBase(BaseModel):
    title: str
    content: str
    category: str

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1 or len(v) > 500:
            raise ValueError("Title must be between 1 and 500 characters")
        return v

    @field_validator("content")
    @classmethod
    def validate_content(cls, v: str) -> str:
        if len(v) < 1 or len(v) > 50000:
            raise ValueError("Content must be between 1 and 50000 characters")
        return v

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1 or len(v) > 100:
            raise ValueError("Category must be between 1 and 100 characters")
        return v

class BlogPostCreate(BlogPostBase):
    trainer_id: Optional[int] = None

class BlogPostOut(BlogPostBase):
    id: int
    created_at: datetime
    trainer_id: int
    author_name: str = ""

    model_config = ConfigDict(from_attributes=True)