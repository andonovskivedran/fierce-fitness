from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.api.deps import get_db, get_current_active_user
from app.models.blog import BlogPost
from app.models.user import User, RoleEnum
from app.models.trainer import Trainer
from app.schemas.blog import BlogPostCreate, BlogPostOut

router = APIRouter(prefix="/blog", tags=["Blog"])


@router.get("/", response_model=List[BlogPostOut])
async def get_all_blogs(db: AsyncSession = Depends(get_db), skip: int = 0, limit: int = 10):
    result = await db.execute(select(BlogPost).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/{id}", response_model=BlogPostOut)
async def get_blog(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BlogPost).where(BlogPost.id == id))
    blog = result.scalars().first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


@router.post("/", response_model=BlogPostOut, status_code=status.HTTP_201_CREATED)
async def create_blog(
    blog_in: BlogPostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role not in [RoleEnum.trainer, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    if current_user.role == RoleEnum.admin:
        if not blog_in.trainer_id:
            raise HTTPException(
                status_code=400,
                detail="Admin must provide a trainer_id to publish under."
            )
        result = await db.execute(select(Trainer).where(Trainer.id == blog_in.trainer_id))
        trainer = result.scalars().first()
        if not trainer:
            raise HTTPException(status_code=404, detail="Specified trainer not found.")
        resolved_trainer_id = trainer.id

    else:
        result = await db.execute(select(Trainer).where(Trainer.user_id == current_user.id))
        trainer = result.scalars().first()
        if not trainer:
            raise HTTPException(
                status_code=404,
                detail="Trainer profile not found. Please create a trainer profile first."
            )
        resolved_trainer_id = trainer.id

    new_blog = BlogPost(
        title=blog_in.title,
        content=blog_in.content,
        category=blog_in.category,
        trainer_id=resolved_trainer_id
    )
    db.add(new_blog)
    await db.commit()
    await db.refresh(new_blog)

    return new_blog