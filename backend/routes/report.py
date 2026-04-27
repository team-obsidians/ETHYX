# c:\Obsidian\Ethyx\backend\routes\report.py
# Report generation route — exports analysis results to PDF
# Full implementation in Phase 5
# CRITICAL: PDF export uses jsPDF on the frontend — native browser print is banned

from __future__ import annotations

from fastapi import APIRouter, Depends

from auth.verify_jwt import UserClaims, verify_jwt

router = APIRouter()


@router.get("/{run_id}")
async def get_report_data(
    run_id: str,
    user: UserClaims = Depends(verify_jwt),
) -> dict[str, str]:
    """
    Get formatted report data for an analysis run.
    Frontend renders the PDF using jsPDF (native browser print is banned).
    Full implementation: Phase 5.
    """
    return {
        "run_id": run_id,
        "status": "not_implemented",
        "message": "Report endpoint available in Phase 5",
    }
