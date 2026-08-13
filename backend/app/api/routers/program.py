from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from pydantic import BaseModel

from app.api.deps import get_db, get_current_active_user
from app.models.program import Program
from app.models.user import User, RoleEnum
from app.schemas.program import ProgramBase, ProgramOut

router = APIRouter(prefix="/programs", tags=["Programs"])


class ProgramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    difficulty_level: Optional[str] = None


@router.get("/", response_model=List[ProgramOut])
async def get_all_programs(db: AsyncSession = Depends(get_db), skip: int = Query(default=0, ge=0), limit: int = Query(default=20, ge=1, le=100)):
    result = await db.execute(select(Program).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/{id}", response_model=ProgramOut)
async def get_program(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Program).where(Program.id == id))
    program = result.scalars().first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program


@router.post("/", response_model=ProgramOut, status_code=status.HTTP_201_CREATED)
async def create_program(
        program_in: ProgramBase,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can add programs")

    new_program = Program(**program_in.model_dump())
    db.add(new_program)
    await db.commit()
    await db.refresh(new_program)
    return new_program


@router.put("/{id}", response_model=ProgramOut)
async def update_program(
    id: int,
    program_in: ProgramUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can update programs")

    result = await db.execute(select(Program).where(Program.id == id))
    program = result.scalars().first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    update_data = program_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(program, field, value)

    await db.commit()
    await db.refresh(program)
    return program


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_program(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can delete programs")

    result = await db.execute(select(Program).where(Program.id == id))
    program = result.scalars().first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    await db.delete(program)
    await db.commit()
