from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from pydantic import BaseModel

from app.api.deps import get_db, get_current_active_user
from app.models.appointment import Appointment
from app.models.trainer import Trainer
from app.models.user import User, RoleEnum
from app.schemas.appointment import AppointmentCreate, AppointmentOut

router = APIRouter(prefix="/appointments", tags=["Appointments"])


class AppointmentStatusUpdate(BaseModel):
    status: str


@router.post("/book", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
async def book_appointment(
        appointment_in: AppointmentCreate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    trainer_check = await db.execute(select(Trainer).where(Trainer.id == appointment_in.trainer_id))
    if not trainer_check.scalars().first():
        raise HTTPException(status_code=404, detail="Trainer not found")

    new_app = Appointment(
        member_id=current_user.id,
        trainer_id=appointment_in.trainer_id,
        start_time=appointment_in.start_time,
        status="scheduled"
    )
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)
    return new_app


@router.get("/my-schedule", response_model=List[AppointmentOut])
async def get_my_schedule(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(select(Appointment).where(Appointment.member_id == current_user.id))
    return result.scalars().all()


@router.get("/trainer-schedule", response_model=List[AppointmentOut])
async def get_trainer_schedule(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.trainer:
        raise HTTPException(status_code=403, detail="Not a trainer")

    trainer_result = await db.execute(select(Trainer).where(Trainer.user_id == current_user.id))
    trainer = trainer_result.scalars().first()

    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer profile not found for this user")

    app_result = await db.execute(select(Appointment).where(Appointment.trainer_id == trainer.id))
    return app_result.scalars().all()


@router.patch("/{id}/status", response_model=AppointmentOut)
async def update_appointment_status(
    id: int,
    update: AppointmentStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.trainer:
        raise HTTPException(status_code=403, detail="Only trainers can update appointment status")

    trainer_result = await db.execute(select(Trainer).where(Trainer.user_id == current_user.id))
    trainer = trainer_result.scalars().first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer profile not found")

    result = await db.execute(select(Appointment).where(Appointment.id == id))
    appointment = result.scalars().first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if appointment.trainer_id != trainer.id:
        raise HTTPException(status_code=403, detail="Can only update your own appointments")

    valid_statuses = ["scheduled", "completed", "cancelled"]
    if update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {valid_statuses}")

    appointment.status = update.status
    await db.commit()
    await db.refresh(appointment)
    return appointment


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_appointment(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(select(Appointment).where(Appointment.id == id))
    appointment = result.scalars().first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if appointment.member_id != current_user.id and current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this appointment")

    await db.delete(appointment)
    await db.commit()
