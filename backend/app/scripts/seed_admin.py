import asyncio
import os
from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User, RoleEnum
from app.models.membership import MembershipPlan
from sqlalchemy.future import select

async def create_seed_data():
    async with AsyncSessionLocal() as db:
        admin_email = os.getenv("ADMIN_EMAIL", "admin@fiercefitness.com")
        admin_password = os.getenv("ADMIN_PASSWORD")
        if not admin_password:
            print("WARNING: ADMIN_PASSWORD env var not set. Skipping admin creation.")
            return

        result = await db.execute(
            select(User).where(User.role == RoleEnum.admin)
        )
        if not result.scalars().first():
            admin = User(
                first_name="Admin",
                last_name="Fierce",
                email=admin_email,
                hashed_password=get_password_hash(admin_password),
                role=RoleEnum.admin,
                is_active=True
            )
            db.add(admin)
            print(f"Admin created: {admin_email}")
        else:
            print("Admin already exists.")

        plans_result = await db.execute(select(MembershipPlan))
        if not plans_result.scalars().first():
            plans = [
                MembershipPlan(name="Basic", price=1890.0, features="Gym access,Basic group classes,Sauna"),
                MembershipPlan(name="Premium", price=2890.0, features="Gym access,All group classes,Sauna & steam room,2 PT sessions,Nutrition plan"),
                MembershipPlan(name="Elite", price=3990.0, features="Gym access,All group classes,Sauna & steam room,Unlimited PT sessions,Personal nutritionist,Weekly massage"),
            ]
            db.add_all(plans)
            print("Membership plans created: Basic, Premium, Elite")
        else:
            print("Membership plans already exist.")

        await db.commit()

if __name__ == "__main__":
    asyncio.run(create_seed_data())
