# c:\Obsidian\Ethyx\backend\utils\azure_blob.py
# Azure Blob Storage helpers for ETHYX AI
# Dependencies: azure-storage-blob, azure-identity

from __future__ import annotations

import os
import logging
from datetime import datetime, timedelta, timezone

from azure.core.exceptions import ResourceExistsError
from azure.storage.blob import (
    BlobServiceClient,
    generate_blob_sas,
    BlobSasPermissions,
)

logger = logging.getLogger("ethyx.azure")

# CRITICAL: AZURE_STORAGE_CONNECTION_STRING is backend-only.
# It must NEVER appear as NEXT_PUBLIC_AZURE_* in the frontend.
_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
_CONTAINER_NAME = os.getenv("AZURE_STORAGE_CONTAINER_NAME", "ethyx-uploads")


def _get_service_client() -> BlobServiceClient:
    """Create a BlobServiceClient from the connection string."""
    if not _CONNECTION_STRING:
        raise RuntimeError(
            "AZURE_STORAGE_CONNECTION_STRING not configured. "
            "This is a backend-only env var."
        )
    return BlobServiceClient.from_connection_string(_CONNECTION_STRING)


def generate_sas_upload_url(
    blob_name: str,
    *,
    expiry_minutes: int = 15,
) -> str:
    """
    Generate a SAS URL for uploading a blob (CSV dataset).

    Args:
        blob_name: Name/path for the blob in the container.
        expiry_minutes: How long the SAS token is valid (default 15 min).

    Returns:
        Full SAS URL that the frontend can PUT to directly.
    """
    service_client = _get_service_client()
    account_name = service_client.account_name

    if not account_name:
        raise RuntimeError("Could not determine storage account name")

    container_client = service_client.get_container_client(_CONTAINER_NAME)
    try:
        container_client.create_container()
    except ResourceExistsError:
        pass

    # Extract account key from connection string
    parts = dict(
        pair.split("=", 1)
        for pair in _CONNECTION_STRING.split(";")  # type: ignore[union-attr]
        if "=" in pair
    )
    account_key = parts.get("AccountKey", "")

    sas_token = generate_blob_sas(
        account_name=account_name,
        container_name=_CONTAINER_NAME,
        blob_name=blob_name,
        account_key=account_key,
        permission=BlobSasPermissions(write=True, create=True),
        expiry=datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes),
    )

    return (
        f"https://{account_name}.blob.core.windows.net/"
        f"{_CONTAINER_NAME}/{blob_name}?{sas_token}"
    )


async def download_blob(blob_name: str) -> bytes:
    """
    Download a blob's content as bytes for CSV processing.

    Args:
        blob_name: Name/path of the blob to download.

    Returns:
        Raw bytes of the blob content.
    """
    import asyncio

    def _sync_download() -> bytes:
        service_client = _get_service_client()
        blob_client = service_client.get_blob_client(
            container=_CONTAINER_NAME,
            blob=blob_name,
        )
        return blob_client.download_blob().readall()

    return await asyncio.to_thread(_sync_download)
