from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class BlogPostBase(BaseModel):
    title: str
    content: str
    category: str

class BlogPostCreate(BlogPostBase):
    trainer_id: Optional[int] = None

class BlogPostOut(BlogPostBase):
    id: int
    created_at: datetime
    trainer_id: int

    model_config = ConfigDict(from_attributes=True)