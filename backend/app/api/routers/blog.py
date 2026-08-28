from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel

from app.api.deps import get_db, get_current_active_user
from app.models.blog import BlogPost
from app.models.user import User, RoleEnum
from app.models.trainer import Trainer
from app.schemas.blog import BlogPostCreate, BlogPostOut

router = APIRouter(prefix="/blog", tags=["Blog"])


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None


def _enrich_blog(blog: BlogPost) -> dict:
    author_name = ""
    if blog.author and blog.author.user:
        author_name = f"{blog.author.user.first_name} {blog.author.user.last_name}"
    return {
        "id": blog.id,
        "title": blog.title,
        "content": blog.content,
        "category": blog.category,
        "created_at": blog.created_at,
        "trainer_id": blog.trainer_id,
        "author_name": author_name,
    }


@router.get("/", response_model=List[BlogPostOut])
async def get_all_blogs(db: AsyncSession = Depends(get_db), skip: int = Query(default=0, ge=0), limit: int = Query(default=10, ge=1, le=100)):
    result = await db.execute(
        select(BlogPost)
        .options(selectinload(BlogPost.author).selectinload(Trainer.user))
        .order_by(BlogPost.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    blogs = result.scalars().all()
    return [_enrich_blog(b) for b in blogs]


@router.get("/{id}", response_model=BlogPostOut)
async def get_blog(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BlogPost)
        .where(BlogPost.id == id)
        .options(selectinload(BlogPost.author).selectinload(Trainer.user))
    )
    blog = result.scalars().first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return _enrich_blog(blog)


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

    result = await db.execute(
        select(BlogPost)
        .where(BlogPost.id == new_blog.id)
        .options(selectinload(BlogPost.author).selectinload(Trainer.user))
    )
    blog = result.scalars().first()
    return _enrich_blog(blog)


@router.put("/{id}", response_model=BlogPostOut)
async def update_blog(
    id: int,
    blog_in: BlogPostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role not in [RoleEnum.trainer, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    result = await db.execute(
        select(BlogPost)
        .where(BlogPost.id == id)
        .options(selectinload(BlogPost.author).selectinload(Trainer.user))
    )
    blog = result.scalars().first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    if current_user.role == RoleEnum.trainer:
        trainer_result = await db.execute(
            select(Trainer).where(Trainer.user_id == current_user.id)
        )
        trainer = trainer_result.scalars().first()
        if not trainer or trainer.id != blog.trainer_id:
            raise HTTPException(status_code=403, detail="Can only edit your own blog posts")

    update_data = blog_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(blog, field, value)

    await db.commit()
    await db.refresh(blog)

    result = await db.execute(
        select(BlogPost)
        .where(BlogPost.id == id)
        .options(selectinload(BlogPost.author).selectinload(Trainer.user))
    )
    blog = result.scalars().first()
    return _enrich_blog(blog)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role not in [RoleEnum.trainer, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    result = await db.execute(select(BlogPost).where(BlogPost.id == id))
    blog = result.scalars().first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    if current_user.role == RoleEnum.trainer:
        trainer_result = await db.execute(
            select(Trainer).where(Trainer.user_id == current_user.id)
        )
        trainer = trainer_result.scalars().first()
        if not trainer or trainer.id != blog.trainer_id:
            raise HTTPException(status_code=403, detail="Can only delete your own blog posts")

    await db.delete(blog)
    await db.commit()
