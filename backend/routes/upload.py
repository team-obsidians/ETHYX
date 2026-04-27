# c:\Obsidian\Ethyx\backend\routes\upload.py
# Upload route — generates SAS URLs for dataset upload
# CRITICAL: Model uploads return mock only — no deserialization of user-supplied bytes

from __future__ import annotations

import uuid
from pathlib import PurePath
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from auth.verify_jwt import UserClaims, verify_jwt
from utils.azure_blob import generate_sas_upload_url

router = APIRouter()


class UploadUrlRequest(BaseModel):
    """Request body for generating a SAS upload URL."""
    filename: str = Field(..., description="Original filename being uploaded")
    content_type: Optional[str] = Field("text/csv", description="MIME type of the file")


class UploadUrlResponse(BaseModel):
    """Response with the SAS upload URL."""
    upload_url: str
    blob_name: str


@router.post("/sas-url", response_model=UploadUrlResponse)
async def get_upload_url(
    body: UploadUrlRequest,
    user: UserClaims = Depends(verify_jwt),
) -> UploadUrlResponse:
    """
    Generate a time-limited SAS URL for the frontend to upload a dataset directly
    to Azure Blob Storage. The URL expires after 15 minutes.
    """
    filename = PurePath(body.filename.replace("\\", "/")).name
    content_type = body.content_type or "text/csv"

    if not filename.lower().endswith(".csv") or content_type not in {
        "text/csv",
        "application/vnd.ms-excel",
    }:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV uploads are supported",
        )

    # Prefix with user ID for isolation
    blob_name = f"users/{user.id}/audits/{uuid.uuid4()}/{filename}"

    try:
        upload_url = generate_sas_upload_url(blob_name, expiry_minutes=15)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate upload URL: {e}",
        )

    return UploadUrlResponse(
        upload_url=upload_url,
        blob_name=blob_name,
    )
