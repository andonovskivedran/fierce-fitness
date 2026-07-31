from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.api.deps import get_db, get_current_active_user
from app.models.program import Program
from app.models.user import User, RoleEnum
from app.schemas.program import ProgramBase, ProgramOut

router = APIRouter(prefix="/programs", tags=["Programs"])


@router.get("/", response_model=List[ProgramOut])
async def get_all_programs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Program))
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