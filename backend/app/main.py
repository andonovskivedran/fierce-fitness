import os
import time
from collections import defaultdict
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.routers import contact, newsletter, auth, blog, trainer, membership, program, appointment

app = FastAPI(
    title="Fierce Fitness API",
    description="Backend API for the Fierce Fitness app",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    root_path=os.getenv("ROOT_PATH", ""),
)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:8000,http://127.0.0.1:8000,"
    "http://localhost:5173,http://127.0.0.1:5173,"
    "http://localhost:3000,http://127.0.0.1:3000,"
    "http://localhost:5500,http://127.0.0.1:5500"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^(https?://(localhost|127\.0\.0\.1)(:\d+)?|null)$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        if request.url.path.endswith(("/docs", "/redoc", "/openapi.json")):
            return response

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

        if os.getenv("ENVIRONMENT") == "production":
            response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"

        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; "
            "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; "
            "img-src 'self' data: https:; "
            "frame-src https://www.google.com https://www.google.com/maps; "
            "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 http://localhost:5173 http://127.0.0.1:5173 http://localhost:5500 http://127.0.0.1:5500 http://localhost:3000 http://127.0.0.1:3000"
        )
        return response


class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.rstrip("/") == "":
            return await call_next(request)

        if os.getenv("ENVIRONMENT") == "production":
            proto = request.headers.get("x-forwarded-proto", request.url.scheme)
            if proto != "https":
                from fastapi.responses import RedirectResponse
                url = str(request.url).replace("http://", "https://", 1)
                return RedirectResponse(url, status_code=301)
        return await call_next(request)


_rate_limit_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))
RATE_LIMIT_MAX_REQUESTS = {
    "auth/login": int(os.getenv("RATE_LIMIT_LOGIN", "120")),
    "auth/register": int(os.getenv("RATE_LIMIT_REGISTER", "60")),
    "contact/": 30,
    "newsletter/": 30,
    "memberships/subscribe": 60,
    "memberships/switch": 60,
    "memberships/deactivate": 60,
    "appointments/book": 60,
}


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path.rstrip("/")
        if request.method in ("POST", "PATCH", "DELETE"):
            matched = next((rp for rp in RATE_LIMIT_MAX_REQUESTS if path.endswith(rp)), None)
            if matched:
                # Use X-Forwarded-For / X-Real-IP set by Nginx so each
                # real client gets its own rate-limit bucket instead of
                # every request sharing the single proxy container IP.
                forwarded = request.headers.get("x-forwarded-for")
                if forwarded:
                    client_ip = forwarded.split(",")[0].strip()
                else:
                    client_ip = (
                        request.headers.get("x-real-ip")
                        or (request.client.host if request.client else "unknown")
                    )
                key = f"{client_ip}:{matched}"
                now = time.time()
                _rate_limit_store[key] = [
                    t for t in _rate_limit_store[key] if now - t < RATE_LIMIT_WINDOW
                ]
                max_req = RATE_LIMIT_MAX_REQUESTS[matched]
                if max_req > 0 and len(_rate_limit_store[key]) >= max_req:
                    origin = request.headers.get("origin", "*")
                    return Response(
                        content='{"detail":"Премногу барања. Ве молиме обидете се повторно за кратко."}',
                        status_code=429,
                        media_type="application/json",
                        headers={
                            "Access-Control-Allow-Origin": origin,
                            "Access-Control-Allow-Credentials": "true",
                        },
                    )
                _rate_limit_store[key].append(now)
        return await call_next(request)


app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(HTTPSRedirectMiddleware)

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