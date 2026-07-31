from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.api.deps import get_db, get_current_active_user
from app.models.trainer import Trainer
from app.models.user import User, RoleEnum
from app.schemas.trainer import TrainerCreate, TrainerOut

router = APIRouter(prefix="/trainers", tags=["Trainers"])


@router.get("/", response_model=List[TrainerOut])
async def get_all_trainers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trainer))
    return result.scalars().all()


@router.get("/{id}", response_model=TrainerOut)
async def get_trainer(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trainer).where(Trainer.id == id))
    trainer = result.scalars().first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    return trainer


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
    return new_trainer