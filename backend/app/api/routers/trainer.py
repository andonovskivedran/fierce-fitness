from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel

from app.api.deps import get_db, get_current_active_user
from app.models.trainer import Trainer
from app.models.user import User, RoleEnum
from app.schemas.trainer import TrainerCreate, TrainerOut

router = APIRouter(prefix="/trainers", tags=["Trainers"])


class TrainerUpdate(BaseModel):
    specialty: Optional[str] = None
    bio: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    image_url: Optional[str] = None


def _enrich_trainer(trainer: Trainer) -> dict:
    return {
        "id": trainer.id,
        "user_id": trainer.user_id,
        "specialty": trainer.specialty,
        "bio": trainer.bio,
        "instagram_url": trainer.instagram_url,
        "facebook_url": trainer.facebook_url,
        "image_url": trainer.image_url,
        "first_name": trainer.user.first_name if trainer.user else "",
        "last_name": trainer.user.last_name if trainer.user else "",
    }


@router.get("/", response_model=List[TrainerOut])
async def get_all_trainers(db: AsyncSession = Depends(get_db), skip: int = Query(default=0, ge=0), limit: int = Query(default=20, ge=1, le=100)):
    result = await db.execute(
        select(Trainer).options(selectinload(Trainer.user)).offset(skip).limit(limit)
    )
    trainers = result.scalars().all()
    return [_enrich_trainer(t) for t in trainers]


@router.get("/{id}", response_model=TrainerOut)
async def get_trainer(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Trainer).where(Trainer.id == id).options(selectinload(Trainer.user))
    )
    trainer = result.scalars().first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    return _enrich_trainer(trainer)


@router.post("/", response_model=TrainerOut, status_code=status.HTTP_201_CREATED)
async def create_trainer(
        trainer_in: TrainerCreate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can add trainers")

    new_trainer = Trainer(**trainer_in.model_dump())
    db.add(new_trainer)
    await db.commit()
    await db.refresh(new_trainer)

    result = await db.execute(
        select(Trainer).where(Trainer.id == new_trainer.id).options(selectinload(Trainer.user))
    )
    trainer = result.scalars().first()
    return _enrich_trainer(trainer)


@router.put("/{id}", response_model=TrainerOut)
async def update_trainer(
    id: int,
    trainer_in: TrainerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Trainer).where(Trainer.id == id).options(selectinload(Trainer.user))
    )
    trainer = result.scalars().first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")

    if current_user.role == RoleEnum.admin:
        pass
    elif current_user.role == RoleEnum.trainer and trainer.user_id == current_user.id:
        pass
    else:
        raise HTTPException(status_code=403, detail="Not authorized to update this trainer")

    update_data = trainer_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(trainer, field, value)

    await db.commit()
    await db.refresh(trainer)

    result = await db.execute(
        select(Trainer).where(Trainer.id == id).options(selectinload(Trainer.user))
    )
    trainer = result.scalars().first()
    return _enrich_trainer(trainer)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trainer(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can delete trainers")

    result = await db.execute(select(Trainer).where(Trainer.id == id))
    trainer = result.scalars().first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")

    await db.delete(trainer)
    await db.commit()
