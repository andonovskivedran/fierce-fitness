from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class NewsletterCreate(BaseModel):
    email: EmailStr

class NewsletterOut(NewsletterCreate):
    id: int
    subscribed_at: datetime

    model_config = ConfigDict(from_attributes=True)