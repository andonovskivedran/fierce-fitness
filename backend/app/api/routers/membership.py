from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.api.deps import get_db, get_current_active_user
from app.models.membership import MembershipPlan
from app.models.user import User
from app.schemas.membership import MembershipPlanOut

router = APIRouter(prefix="/memberships", tags=["Memberships"])


@router.get("/plans", response_model=List[MembershipPlanOut])
async def get_plans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MembershipPlan))
    return result.scalars().all()


@router.post("/subscribe")
async def subscribe_membership(
        plan_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    plan_result = await db.execute(select(MembershipPlan).where(MembershipPlan.id == plan_id))
    if not plan_result.scalars().first():
        raise HTTPException(status_code=404, detail="Plan not found")

    return {"message": f"Successfully subscribed to plan {plan_id}", "user_id": current_user.id}