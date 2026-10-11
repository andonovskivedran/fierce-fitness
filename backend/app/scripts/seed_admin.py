import asyncio
import os
from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User, RoleEnum
from app.models.trainer import Trainer
from app.models.membership import MembershipPlan
from sqlalchemy.future import select

PLANS = [
    ("Basic", 1500.0, "Gym access,Basic group classes,Sauna"),
    ("Premium", 2000.0, "Gym access,All group classes,Sauna & steam room,2 PT sessions,Nutrition plan"),
    ("Elite", 2500.0, "Gym access,All group classes,Sauna & steam room,Unlimited PT sessions,Personal nutritionist,Weekly massage"),
]

async def get_user(db, email):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()


async def create_seed_data():
    async with AsyncSessionLocal() as db:
        admin_email = os.getenv("ADMIN_EMAIL", "admin@fiercefitness.com")
        admin_password = os.getenv("ADMIN_PASSWORD")

        if not admin_password:
            print("WARNING: ADMIN_PASSWORD not set. Skipping admin creation.")
        elif not await get_user(db, admin_email):
            db.add(User(first_name="Admin", last_name="Fierce", email=admin_email,
                        hashed_password=get_password_hash(admin_password),
                        role=RoleEnum.admin, is_active=True))
            print(f"Admin created: {admin_email}")
        else:
            print("Admin already exists.")

        if not (await db.execute(select(MembershipPlan))).scalars().first():
            db.add_all([MembershipPlan(name=n, price=p, features=f) for n, p, f in PLANS])
            print("Membership plans created.")
        else:
            print("Membership plans already exist.")

        if os.getenv("SEED_TEST_USERS", "true").lower() == "true":
            trainer_email = "trainer@fiercefitness.com"
            if not await get_user(db, trainer_email):
                user = User(first_name="Test", last_name="Trainer", email=trainer_email,
                            hashed_password=get_password_hash(os.getenv("TRAINER_PASSWORD", "Trainer123!")),
                            role=RoleEnum.trainer, is_active=True)
                db.add(user)
                await db.flush()
                db.add(Trainer(user_id=user.id, specialty="Strength & Conditioning",
                               bio="Test trainer account used for demo and grading."))
                print(f"Test trainer created: {trainer_email}")

            member_email = "member@fiercefitness.com"
            if not await get_user(db, member_email):
                db.add(User(first_name="Test", last_name="Member", email=member_email,
                            hashed_password=get_password_hash(os.getenv("MEMBER_PASSWORD", "Member123!")),
                            role=RoleEnum.member, is_active=True))
                print(f"Test member created: {member_email}")

        await db.commit()

if __name__ == "__main__":
    asyncio.run(create_seed_data())
