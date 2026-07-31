import asyncio
from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User, RoleEnum
from sqlalchemy.future import select

async def create_admin():
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(User).where(User.role == RoleEnum.admin)
        )
        if result.scalars().first():
            print("Admin already exists.")
            return

        admin = User(
            first_name="Admin",
            last_name="Fierce",
            email="admin@fiercefitness.com",
            hashed_password=get_password_hash("admin123!"),
            role=RoleEnum.admin,
            is_active=True
        )
        db.add(admin)
        await db.commit()
        print("Admin created: admin@fiercefitness.com / admin123!")

if __name__ == "__main__":
    asyncio.run(create_admin())