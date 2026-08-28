from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.api.deps import get_db, get_current_active_user
from app.models.newsletter import NewsletterSubscriber
from app.models.user import User, RoleEnum
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


@router.get("/", response_model=List[NewsletterOut])
async def get_all_subscribers(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
        skip: int = Query(default=0, ge=0),
        limit: int = Query(default=50, ge=1, le=100)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can view subscribers")

    result = await db.execute(select(NewsletterSubscriber).offset(skip).limit(limit))
    return result.scalars().all()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def unsubscribe(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can remove subscribers")

    result = await db.execute(select(NewsletterSubscriber).where(NewsletterSubscriber.id == id))
    subscriber = result.scalars().first()
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")

    await db.delete(subscriber)
    await db.commit()
