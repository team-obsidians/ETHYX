# c:\Obsidian\Ethyx\backend\routes\auth.py
# Auth-related routes for ETHYX AI
# (Supabase handles actual auth — this route provides profile info)

from __future__ import annotations

from fastapi import APIRouter, Depends

from auth.verify_jwt import UserClaims, verify_jwt

router = APIRouter()


@router.get("/me")
async def get_current_user(
    user: UserClaims = Depends(verify_jwt),
) -> dict[str, str]:
    """
    Return the currently authenticated user's identity.
    Token is verified by the verify_jwt dependency.
    """
    return {
        "id": user.id,
        "email": user.email,
    }
