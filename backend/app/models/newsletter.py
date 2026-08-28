from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from .base import Base


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    subscribed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))