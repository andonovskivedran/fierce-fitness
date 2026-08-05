from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import datetime, timezone
from app.api.deps import get_db, get_current_active_user
from app.models.membership import MembershipPlan
from app.models.user_membership import UserMembership
from app.models.user import User
from app.schemas.membership import MembershipPlanOut
from app.schemas.user_membership import UserMembershipOut

router = APIRouter(prefix="/memberships", tags=["Memberships"])


@router.get("/plans", response_model=List[MembershipPlanOut])
async def get_plans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MembershipPlan))
    return result.scalars().all()


@router.post("/subscribe", response_model=UserMembershipOut, status_code=201)
async def subscribe_membership(
        plan_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    plan_result = await db.execute(select(MembershipPlan).where(MembershipPlan.id == plan_id))
    plan = plan_result.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    existing = await db.execute(
        select(UserMembership).where(
            UserMembership.user_id == current_user.id,
            UserMembership.plan_id == plan_id,
            UserMembership.is_active == True
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Already subscribed to this plan")

    membership = UserMembership(
        user_id=current_user.id,
        plan_id=plan_id,
        start_date=datetime.now(timezone.utc).replace(tzinfo=None),
        is_active=True
    )
    db.add(membership)
    await db.commit()
    await db.refresh(membership)
    return membership


@router.get("/my", response_model=List[UserMembershipOut])
async def get_my_memberships(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(UserMembership).where(UserMembership.user_id == current_user.id)
    )
    return result.scalars().all()
