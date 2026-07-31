from pydantic import BaseModel, ConfigDict
from typing import Optional

class ProgramBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    difficulty_level: str

class ProgramOut(ProgramBase):
    id: int

    model_config = ConfigDict(from_attributes=True)