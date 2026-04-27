# c:\Obsidian\Ethyx\backend\routes\analyze.py
# Analysis pipeline route — POST to start, GET to poll status
# Dependencies: fastapi, asyncio, slowapi

from __future__ import annotations

import asyncio
import logging
import uuid
import json
from dataclasses import asdict
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field

from auth.verify_jwt import UserClaims, verify_jwt
from main import limiter
from utils.db import get_pool
from utils.azure_blob import download_blob
from utils.fairness import compute_fairness_metrics

logger = logging.getLogger("ethyx.analyze")

router = APIRouter()

# ─── Request / Response Models ────────────────────

class AnalyzeRequest(BaseModel):
    """POST /analyze request body."""
    audit_id: str = Field(..., description="UUID of the audit record created by frontend")


class AnalyzeResponse(BaseModel):
    """POST /analyze response."""
    audit_id: str
    status: str
    message: str


class StatusResponse(BaseModel):
    """GET /analyze/{audit_id}/status response."""
    audit_id: str
    status: str  # "uploaded" | "analyzing" | "completed" | "failed" | "timeout"
    error_message: Optional[str] = None
    results: Optional[dict[str, Any]] = None


# ─── Endpoints ────────────────────────────────────

@router.post("", response_model=AnalyzeResponse, status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("10/hour")
async def start_analysis(
    request: Request,
    payload: dict[str, Any] = Body(...),
    user: UserClaims = Depends(verify_jwt),
) -> AnalyzeResponse:
    """
    Start a new fairness analysis run.
    Rate limited to 3/hour per IP.
    Updates DB row status and launches async background task.
    """
    audit_id = payload.get("audit_id")
    if not isinstance(audit_id, str) or not audit_id.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="audit_id is required",
        )

    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                # Verify ownership and lock the audit row before changing state.
                row = await conn.fetchrow(
                    """
                    SELECT id, blob_path, target_column, protected_attributes, positive_label, status
                    FROM audits
                    WHERE id = $1 AND user_id = $2
                    FOR UPDATE
                    """,
                    audit_id,
                    user.id,
                )

                if not row:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Audit record not found or access denied"
                    )

                if not str(row["blob_path"] or "").strip():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Audit has no uploaded dataset blob",
                    )

                allowed_start_statuses = {"uploaded", "failed", "timeout"}
                if row["status"] not in allowed_start_statuses:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"Audit cannot be analyzed from status '{row['status']}'",
                    )

                # Mark as analyzing
                await conn.execute(
                    """
                    UPDATE audits
                    SET status = 'analyzing', updated_at = now()
                    WHERE id = $1 AND user_id = $2
                    """,
                    audit_id,
                    user.id,
                )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to start analysis for audit {audit_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start analysis",
        )

    # Launch background analysis task
    asyncio.create_task(_run_analysis(audit_id, user.id, dict(row)))

    return AnalyzeResponse(
        audit_id=audit_id,
        status="analyzing",
        message="Analysis queued successfully",
    )


@router.get("/{audit_id}/status", response_model=StatusResponse)
async def get_analysis_status(
    audit_id: str,
    user: UserClaims = Depends(verify_jwt),
) -> StatusResponse:
    """
    Get the current status of an analysis run.
    Polls this endpoint until status is 'completed' or 'failed'.
    """
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            # Check the audits table
            audit_row = await conn.fetchrow(
                """
                SELECT status
                FROM audits
                WHERE id = $1 AND user_id = $2
                """,
                audit_id,
                user.id,
            )
            
            if not audit_row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Audit record not found",
                )
                
            status_val = audit_row["status"]
            results = None
            error_message = None

            if status_val == "completed":
                # Fetch results from fairness_results
                res_row = await conn.fetchrow(
                    """
                    SELECT metrics, group_results, recommendations
                    FROM fairness_results
                    WHERE audit_id = $1 AND user_id = $2
                    """,
                    audit_id,
                    user.id,
                )
                if res_row:
                    results = {
                        "metrics": json.loads(res_row["metrics"]),
                        "group_results": json.loads(res_row["group_results"]) if res_row["group_results"] else None,
                        "recommendations": json.loads(res_row["recommendations"]) if res_row["recommendations"] else None,
                    }
            elif status_val == "failed" or status_val == "timeout":
                # We can fetch error message from audit_events
                err_row = await conn.fetchrow(
                    """
                    SELECT message
                    FROM audit_events
                    WHERE audit_id = $1 AND user_id = $2 AND event_type = 'error'
                    ORDER BY created_at DESC LIMIT 1
                    """,
                    audit_id,
                    user.id,
                )
                if err_row:
                    error_message = err_row["message"]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch analysis status for {audit_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch analysis status",
        )

    return StatusResponse(
        audit_id=audit_id,
        status=status_val,
        results=results,
        error_message=error_message,
    )


# ─── Background Task ─────────────────────────────

async def _run_analysis(audit_id: str, user_id: str, audit_data: dict[str, Any]) -> None:
    """
    Background task that executes the full analysis pipeline.
    Updates DB status.
    On any error: sets status='failed' and logs to audit_events.
    """
    pool = await get_pool()

    async def _log_event(event_type: str, message: str) -> None:
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO audit_events (audit_id, user_id, event_type, message)
                VALUES ($1, $2, $3, $4)
                """,
                audit_id, user_id, event_type, message
            )

    async def _update_status(new_status: str) -> None:
        async with pool.acquire() as conn:
            await conn.execute(
                """
                UPDATE audits
                SET status = $2, updated_at = now()
                WHERE id = $1 AND user_id = $3
                """,
                audit_id, new_status, user_id
            )

    try:
        await _log_event("info", "Starting dataset download")
        dataset_bytes = await download_blob(audit_data["blob_path"])

        await _log_event("info", "Starting fairness metrics computation")
        
        # We might have multiple protected attributes, for now use the first one
        protected_attributes = json.loads(audit_data["protected_attributes"]) if isinstance(audit_data["protected_attributes"], str) else audit_data["protected_attributes"]
        primary_protected_attribute = protected_attributes[0] if protected_attributes else "gender"

        analysis_results = await compute_fairness_metrics(
            dataset_bytes=dataset_bytes,
            protected_attribute=primary_protected_attribute,
            target_column=audit_data["target_column"],
            positive_label=audit_data.get("positive_label"),
            timeout_seconds=300,
        )

        await _log_event("info", "Storing fairness results")
        risk_score = 100 - int(analysis_results.overall_score)
        
        async with pool.acquire() as conn:
            async with conn.transaction():
                await conn.execute(
                    """
                    DELETE FROM fairness_results
                    WHERE audit_id = $1 AND user_id = $2
                    """,
                    audit_id,
                    user_id,
                )
                await conn.execute(
                    """
                    INSERT INTO fairness_results (
                        audit_id, user_id, overall_risk_score, risk_level,
                        metrics, group_results, recommendations
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    """,
                    audit_id,
                    user_id,
                    risk_score,
                    analysis_results.risk_level,
                    json.dumps([asdict(m) for m in analysis_results.metrics]),
                    json.dumps(analysis_results.demographic_breakdown),
                    json.dumps(analysis_results.recommendations),
                )
                await conn.execute(
                    """
                    UPDATE audits
                    SET status = 'completed',
                        risk_score = $2,
                        updated_at = now()
                    WHERE id = $1 AND user_id = $3
                    """,
                    audit_id,
                    risk_score,
                    user_id,
                )

        await _log_event("info", "Analysis completed successfully")
        logger.info(f"Analysis {audit_id} completed successfully")

    except asyncio.TimeoutError:
        await _log_event("error", "Analysis exceeded 5 minute timeout")
        await _update_status("timeout")
        logger.error(f"Analysis {audit_id} timed out")

    except Exception as e:
        error_msg = str(e)
        await _log_event("error", error_msg)
        await _update_status("failed")
        logger.error(f"Analysis {audit_id} failed: {error_msg}")

        # Report to Sentry
        try:
            import sentry_sdk
            sentry_sdk.capture_exception(e)
        except Exception:
            pass
