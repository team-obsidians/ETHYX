# c:\Obsidian\Ethyx\backend\auth\verify_jwt.py
# JWT verification for Supabase-issued tokens
# Dependencies: PyJWT, cryptography

from __future__ import annotations

import os
from dataclasses import dataclass

import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

_bearer_scheme = HTTPBearer()
_ASYMMETRIC_ALGORITHMS = {"RS256", "ES256"}


@dataclass(frozen=True)
class UserClaims:
    """Verified user identity from a Supabase JWT."""
    id: str
    email: str


def verify_jwt(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> UserClaims:
    """
    FastAPI dependency that verifies a Supabase JWT.
    Uses SUPABASE_JWT_SECRET for legacy HS256 projects, or the Supabase JWKS
    endpoint for projects using asymmetric signing keys.

    Raises:
        HTTPException 401: If the token is expired, invalid, or missing claims.
    """
    token = credentials.credentials

    try:
        header = jwt.get_unverified_header(token)
        alg = header.get("alg")

        if alg == "HS256":
            secret = os.getenv("SUPABASE_JWT_SECRET")
            if not secret:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="JWT secret not configured",
                )
            payload: dict[str, object] = jwt.decode(
                token,
                secret,
                algorithms=["HS256"],
                audience="authenticated",
            )
        elif alg in _ASYMMETRIC_ALGORITHMS:
            supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
            if not supabase_url:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="SUPABASE_URL not configured for JWKS token verification",
                )

            jwks_client = PyJWKClient(
                f"{supabase_url}/auth/v1/.well-known/jwks.json"
            )
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=[alg],
                audience="authenticated",
                issuer=f"{supabase_url}/auth/v1",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Unsupported token signing algorithm: {alg}",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except HTTPException:
        raise
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    email = payload.get("email")

    if not isinstance(user_id, str) or not isinstance(email, str):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing required claims (sub, email)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return UserClaims(id=user_id, email=email)
