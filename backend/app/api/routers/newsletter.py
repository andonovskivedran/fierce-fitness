from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api.deps import get_db
from app.models.newsletter import NewsletterSubscriber
from app.schemas.newsletter import NewsletterCreate, NewsletterOut

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


@router.post("/", response_model=NewsletterOut, status_code=status.HTTP_201_CREATED)
async def subscribe_newsletter(
        subscriber_in: NewsletterCreate,
        db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(NewsletterSubscriber).where(NewsletterSubscriber.email == subscriber_in.email))
    existing_subscriber = result.scalars().first()

    if existing_subscriber:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already subscribed."
        )

    new_subscriber = NewsletterSubscriber(email=subscriber_in.email)
    db.add(new_subscriber)
    await db.commit()
    await db.refresh(new_subscriber)

    return new_subscriber