from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import Optional
from app.api.deps import get_db, get_current_active_user
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User, RoleEnum
from app.models.trainer import Trainer
from app.schemas.user import UserCreate, UserOut
from app.schemas.trainer import TrainerOut

router = APIRouter(prefix="/auth", tags=["Authentication"])


class TrainerAssignment(BaseModel):
    specialty: str
    bio: Optional[str] = ""
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    image_url: Optional[str] = None


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=RoleEnum.member
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login")
async def login(
        db: AsyncSession = Depends(get_db),
        form_data: OAuth2PasswordRequestForm = Depends()
):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.patch("/users/{user_id}/make-trainer", response_model=UserOut)
async def make_trainer(
    user_id: int,
    assignment: TrainerAssignment,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can assign trainer role")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == RoleEnum.trainer:
        raise HTTPException(status_code=400, detail="User is already a trainer")

    existing_profile = await db.execute(
        select(Trainer).where(Trainer.user_id == user_id)
    )
    if existing_profile.scalars().first():
        raise HTTPException(status_code=400, detail="User already has a trainer profile")

    trainer = Trainer(
        user_id=user_id,
        specialty=assignment.specialty,
        bio=assignment.bio,
        instagram_url=assignment.instagram_url,
        facebook_url=assignment.facebook_url,
        image_url=assignment.image_url
    )
    db.add(trainer)

    user.role = RoleEnum.trainer
    await db.commit()
    await db.refresh(user)
    return user
