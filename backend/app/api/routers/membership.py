from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from datetime import datetime, timezone
from app.api.deps import get_db, get_current_active_user
from app.models.membership import MembershipPlan
from app.models.user_membership import UserMembership
from app.models.user import User
from app.schemas.membership import MembershipPlanOut
from app.schemas.user_membership import UserMembershipOut

router = APIRouter(prefix="/memberships", tags=["Memberships"])


def _enrich_membership(m, plan: MembershipPlan = None) -> dict:
    p = plan if plan else (m.plan if hasattr(m, '_sa_instance_state') and 'plan' in m.__dict__ else None)
    return {
        "id": m.id,
        "user_id": m.user_id,
        "plan_id": m.plan_id,
        "plan_name": p.name if p else "",
        "plan_price": p.price if p else 0.0,
        "plan_features": p.features if p else "",
        "start_date": m.start_date,
        "end_date": m.end_date,
        "is_active": m.is_active,
        "status": "ACTIVE" if m.is_active else "INACTIVE",
    }


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
    return _enrich_membership(membership, plan)


@router.get("/my", response_model=List[UserMembershipOut])
async def get_my_memberships(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(UserMembership)
        .where(UserMembership.user_id == current_user.id)
        .options(selectinload(UserMembership.plan))
    )
    memberships = result.scalars().all()
    return [_enrich_membership(m) for m in memberships]


@router.get("/active", response_model=UserMembershipOut)
async def get_active_membership(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(UserMembership)
        .where(
            UserMembership.user_id == current_user.id,
            UserMembership.is_active == True
        )
        .options(selectinload(UserMembership.plan))
    )
    membership = result.scalars().first()
    if not membership:
        raise HTTPException(status_code=404, detail="No active membership")
    return _enrich_membership(membership)


@router.post("/switch", response_model=UserMembershipOut, status_code=200)
async def switch_membership(
        plan_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    plan_result = await db.execute(select(MembershipPlan).where(MembershipPlan.id == plan_id))
    plan = plan_result.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    active_result = await db.execute(
        select(UserMembership).where(
            UserMembership.user_id == current_user.id,
            UserMembership.is_active == True
        )
    )
    active = active_result.scalars().first()

    if active:
        if active.plan_id == plan_id:
            raise HTTPException(status_code=400, detail="Already on this plan")
        active.is_active = False
        active.end_date = datetime.now(timezone.utc).replace(tzinfo=None)
        db.add(active)

    membership = UserMembership(
        user_id=current_user.id,
        plan_id=plan_id,
        start_date=datetime.now(timezone.utc).replace(tzinfo=None),
        is_active=True
    )
    db.add(membership)
    await db.commit()
    await db.refresh(membership)
    return _enrich_membership(membership, plan)


@router.post("/deactivate", response_model=UserMembershipOut, status_code=200)
async def deactivate_membership(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(UserMembership)
        .where(
            UserMembership.user_id == current_user.id,
            UserMembership.is_active == True
        )
        .options(selectinload(UserMembership.plan))
    )
    membership = result.scalars().first()
    if not membership:
        raise HTTPException(status_code=404, detail="No active membership to deactivate")

    membership.is_active = False
    membership.end_date = datetime.now(timezone.utc).replace(tzinfo=None)
    db.add(membership)
    await db.commit()
    await db.refresh(membership)
    return _enrich_membership(membership)
