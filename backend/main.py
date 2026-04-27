# c:\Obsidian\Ethyx\backend\main.py
# FastAPI entry point for ETHYX AI backend
# Python 3.10.11 EXACT

from __future__ import annotations

import os
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

logger = logging.getLogger("ethyx")
logging.basicConfig(level=logging.INFO)

# ─── Rate Limiter ─────────────────────────────────
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Startup/shutdown lifecycle.
    On startup: mark orphaned running/pending jobs as failed.
    On shutdown: clean up resources.
    """
    logger.info("ETHYX AI backend starting up...")

    # Mark orphaned jobs as failed so users don't wait forever
    try:
        from utils.db import get_pool

        pool = await get_pool()
        async with pool.acquire() as conn:
            count = await conn.execute(
                """
                UPDATE audits
                SET status = 'failed',
                    updated_at = now()
                WHERE status IN ('analyzing', 'queued')
                """
            )
            logger.info(f"Marked orphaned jobs as failed: {count}")
    except Exception as e:
        logger.warning(f"Could not clean orphaned jobs on startup: {e}")

    # Initialize Sentry
    sentry_dsn = os.getenv("SENTRY_DSN")
    if sentry_dsn:
        try:
            import sentry_sdk
            from sentry_sdk.integrations.fastapi import FastApiIntegration

            sentry_sdk.init(
                dsn=sentry_dsn,
                integrations=[FastApiIntegration()],
                traces_sample_rate=0.2,
            )
            logger.info("Sentry initialized")
        except Exception as e:
            logger.warning(f"Sentry init failed: {e}")

    yield

    # Shutdown
    logger.info("ETHYX AI backend shutting down...")


# ─── App Instance ─────────────────────────────────
app = FastAPI(
    title="ETHYX AI API",
    description="AI Bias Detection & Fairness Auditing Platform",
    version="0.1.0",
    lifespan=lifespan,
)

# Attach rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── CORS ─────────────────────────────────────────
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS_ORIGINS = os.getenv("CORS_ORIGINS")

allow_origins = []
if CORS_ORIGINS:
    allow_origins = [origin.strip() for origin in CORS_ORIGINS.split(",") if origin.strip()]
else:
    allow_origins = [FRONTEND_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Routes ───────────────────────────────────────
from routes.analyze import router as analyze_router
from routes.auth import router as auth_router
from routes.upload import router as upload_router
from routes.explain import router as explain_router
from routes.mitigate import router as mitigate_router
from routes.report import router as report_router

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(analyze_router, prefix="/analyze", tags=["Analyze"])
app.include_router(explain_router, prefix="/explain", tags=["Explain"])
app.include_router(mitigate_router, prefix="/mitigate", tags=["Mitigate"])
app.include_router(report_router, prefix="/report", tags=["Report"])


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok", "service": "ethyx-ai"}
