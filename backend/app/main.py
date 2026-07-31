from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import contact, newsletter, auth, blog, trainer, membership, program, appointment

app = FastAPI(
    title="Fierce Fitness API",
    description="Backend API for the Fierce Fitness app",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(blog.router)
app.include_router(contact.router)
app.include_router(newsletter.router)
app.include_router(trainer.router)
app.include_router(program.router)
app.include_router(appointment.router)
app.include_router(membership.router)

@app.get("/", tags=["Health Check"])
async def root():
    return {"message": "Welcome to Fierce Fitness API"}