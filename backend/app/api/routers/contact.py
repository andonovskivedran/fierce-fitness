from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.models.contact import ContactMessage
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