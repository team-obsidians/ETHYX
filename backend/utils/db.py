# c:\Obsidian\Ethyx\backend\utils\db.py
# Async PostgreSQL connection pool for ETHYX AI
# Dependencies: asyncpg

from __future__ import annotations

import os
import logging
from typing import Optional

import asyncpg

logger = logging.getLogger("ethyx.db")

_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    """
    Get or create the asyncpg connection pool.

    Uses DATABASE_URL from environment (Supabase PostgreSQL).
    Pool is created once and reused across the application lifetime.

    Returns:
        asyncpg.Pool: The database connection pool.

    Raises:
        RuntimeError: If DATABASE_URL is not configured.
    """
    global _pool

    if _pool is not None:
        return _pool

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError(
            "DATABASE_URL not configured. Set it to your Supabase PostgreSQL URL."
        )

    _pool = await asyncpg.create_pool(
        database_url,
        min_size=2,
        max_size=10,
        command_timeout=60,
    )
    logger.info("Database pool created")
    return _pool


async def close_pool() -> None:
    """Close the database connection pool on shutdown."""
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
        logger.info("Database pool closed")
