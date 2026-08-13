from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.api.deps import get_db, get_current_active_user
from app.models.contact import ContactMessage
from app.models.user import User, RoleEnum
from app.schemas.contact import ContactMessageCreate, ContactMessageOut

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("/", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(
        message_in: ContactMessageCreate,
        db: AsyncSession = Depends(get_db)
):
    new_message = ContactMessage(
        name=message_in.name,
        email=message_in.email,
        phone=message_in.phone,
        message=message_in.message
    )
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)

    return new_message


@router.get("/", response_model=List[ContactMessageOut])
async def get_all_messages(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
        skip: int = Query(default=0, ge=0),
        limit: int = Query(default=50, ge=1, le=100)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can view contact messages")

    result = await db.execute(select(ContactMessage).offset(skip).limit(limit))
    return result.scalars().all()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can delete contact messages")

    result = await db.execute(select(ContactMessage).where(ContactMessage.id == id))
    message = result.scalars().first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    await db.delete(message)
    await db.commit()
