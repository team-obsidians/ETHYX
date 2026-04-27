# c:\Obsidian\Ethyx\backend\routes\mitigate.py
# Mitigation strategy route — applies bias mitigation techniques
# Full implementation in Phase 4, simulating impact for Phase 7

from __future__ import annotations
import json
import logging
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from auth.verify_jwt import UserClaims, verify_jwt
from utils.db import get_pool

logger = logging.getLogger("ethyx.mitigate")

router = APIRouter()

class MitigateRequest(BaseModel):
    audit_id: str = Field(..., description="UUID of the audit record")
    strategy: str = Field(..., description="Name of the mitigation strategy (e.g. 'reweighing', 'adversarial', 'dir', 'equalized_odds')")

class MitigateResponse(BaseModel):
    audit_id: str
    strategy: str
    status: str
    baseline_metrics: dict[str, Any]
    mitigated_metrics: dict[str, Any]
    latency_impact_ms: int
    python_code: str

class StrategyInfo(BaseModel):
    id: str
    name: str
    description: str
    risk_reduction: float
    complexity: str
    metrics_after: dict[str, float]
    python_code: str

class MitigateDataResponse(BaseModel):
    strategies: list[StrategyInfo]
    current_metrics: dict[str, float]
    audit_id: str

# Strategy simulation parameters
STRATEGIES = {
    "reweighing": {
        "bias_multiplier": 0.2, # Reduces bias to 20% of original
        "accuracy_delta": -0.024, # Drops accuracy by 2.4%
        "latency_ms": 12,
        "code": '''from aif360.algorithms.preprocessing import Reweighing

# 1. Initialize the Reweighing algorithm
rw = Reweighing(
    unprivileged_groups=unprivileged_groups,
    privileged_groups=privileged_groups
)

# 2. Fit and transform the dataset
dataset_transf = rw.fit_transform(dataset)

# 3. Train your model on the transformed dataset
model.fit(dataset_transf.features, dataset_transf.labels, 
          sample_weight=dataset_transf.instance_weights)'''
    },
    "adversarial": {
        "bias_multiplier": 0.1,
        "accuracy_delta": -0.042,
        "latency_ms": 85,
        "code": '''from aif360.algorithms.inprocessing import AdversarialDebiasing
import tensorflow as tf

# 1. Start a TensorFlow session
sess = tf.Session()

# 2. Initialize the Adversarial Debiasing model
adv_debias = AdversarialDebiasing(
    privileged_groups=privileged_groups,
    unprivileged_groups=unprivileged_groups,
    scope_name='adversarial_debiasing',
    debias=True,
    sess=sess
)

# 3. Fit the model to the dataset
adv_debias.fit(dataset)

# 4. Predict using the debiased model
dataset_pred = adv_debias.predict(dataset)'''
    },
    "dir": {
        "bias_multiplier": 0.3,
        "accuracy_delta": -0.011,
        "latency_ms": 5,
        "code": '''from aif360.algorithms.preprocessing import DisparateImpactRemover

# 1. Initialize Disparate Impact Remover
# repair_level=1.0 means fully repair the dataset
dir_algo = DisparateImpactRemover(repair_level=1.0)

# 2. Fit and transform the dataset
dataset_transf = dir_algo.fit_transform(dataset)

# 3. Train your model on the transformed dataset
model.fit(dataset_transf.features, dataset_transf.labels)'''
    },
    "equalized_odds": {
        "bias_multiplier": 0.15,
        "accuracy_delta": -0.035,
        "latency_ms": 2,
        "code": '''from aif360.algorithms.postprocessing import CalibratedEqOddsPostprocessing

# 1. Initialize the Calibrated Equalized Odds post-processing algorithm
cpp = CalibratedEqOddsPostprocessing(
    privileged_groups=privileged_groups,
    unprivileged_groups=unprivileged_groups,
    cost_constraint='fnr' # Optimize for false negative rate
)

# 2. Fit the algorithm using true labels and predicted labels
cpp = cpp.fit(dataset_true, dataset_pred)

# 3. Transform the predictions to satisfy Equalized Odds
dataset_transf = cpp.predict(dataset_pred)'''
    }
}


def _find_metric(metrics: list[dict[str, Any]], names: set[str]) -> Optional[dict[str, Any]]:
    return next((m for m in metrics if m.get("name") in names), None)


@router.post("", response_model=MitigateResponse)
async def apply_mitigation(
    body: MitigateRequest,
    user: UserClaims = Depends(verify_jwt),
) -> MitigateResponse:
    """
    Simulate the application of a mitigation strategy to an analysis run.
    """
    if body.strategy not in STRATEGIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown strategy '{body.strategy}'"
        )
        
    strategy_config = STRATEGIES[body.strategy]

    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            # Check the audits table to ensure user owns it
            audit_row = await conn.fetchrow(
                """
                SELECT status
                FROM audits
                WHERE id = $1 AND user_id = $2
                """,
                body.audit_id,
                user.id,
            )
            
            if not audit_row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Audit record not found or access denied",
                )
                
            if audit_row["status"] != "completed":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Audit must be completed before applying mitigation",
                )

            # Fetch results from fairness_results
            res_row = await conn.fetchrow(
                """
                SELECT metrics, group_results
                FROM fairness_results
                WHERE audit_id = $1 AND user_id = $2
                """,
                body.audit_id,
                user.id,
            )
            
            if not res_row:
                 raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Fairness results not found",
                )
                 
            metrics = json.loads(res_row["metrics"])
            
            # Baseline is derived from the metrics array
            # Assume overall_score is an average or minimum of specific metrics.
            # We'll just construct a baseline object based on the metrics.
            
            # Find Disparate Impact or set a default
            di_metric = _find_metric(metrics, {"Disparate Impact Ratio", "Disparate Impact"})
            baseline_bias_score = di_metric["value"] if di_metric else 0.75
            baseline_accuracy = 0.92 # Default simulated accuracy if we don't have it in metrics
            
            # Let's extract accuracy if it exists in metrics
            acc_metric = _find_metric(metrics, {"Accuracy"})
            if acc_metric:
                baseline_accuracy = acc_metric["value"]
            
            # Calculate mitigated metrics
            # If bias score is high (close to 1 is fair), the delta calculation needs to handle distance from 1.
            # But in our setup, a lower "risk score" means less bias. Let's assume the bias score returned here 
            # represents the magnitude of bias (0 = perfectly fair, 1 = extremely biased) for the sake of the UI
            # Or we can just calculate a simple "Bias Magnitude" = |1 - DI| * 100
            
            baseline_bias_magnitude = abs(1 - baseline_bias_score) * 100
            
            # mitigated bias magnitude is a fraction of the baseline
            mitigated_bias_magnitude = baseline_bias_magnitude * strategy_config["bias_multiplier"]
            
            mitigated_accuracy = baseline_accuracy + strategy_config["accuracy_delta"]
            
            baseline_metrics = {
                "bias_score": baseline_bias_magnitude,
                "accuracy": baseline_accuracy * 100 # Convert to percentage
            }
            
            mitigated_metrics = {
                "bias_score": mitigated_bias_magnitude,
                "accuracy": mitigated_accuracy * 100 # Convert to percentage
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to apply mitigation for {body.audit_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to apply mitigation",
        )

    return MitigateResponse(
        audit_id=body.audit_id,
        strategy=body.strategy,
        status="success",
        baseline_metrics=baseline_metrics,
        mitigated_metrics=mitigated_metrics,
        latency_impact_ms=strategy_config["latency_ms"],
        python_code=strategy_config["code"]
    )

@router.get("/{audit_id}", response_model=MitigateDataResponse)
async def get_mitigation_data(
    audit_id: str,
    user: UserClaims = Depends(verify_jwt),
) -> MitigateDataResponse:
    """
    Fetch baseline metrics and simulated mitigation strategies.
    """
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
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
                    detail="Audit record not found or access denied",
                )
                
            res_row = await conn.fetchrow(
                """
                SELECT metrics
                FROM fairness_results
                WHERE audit_id = $1 AND user_id = $2
                """,
                audit_id,
                user.id,
            )
            
            if not res_row:
                 raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Fairness results not found",
                )
                 
            metrics = json.loads(res_row["metrics"])
            
            di_metric = _find_metric(metrics, {"Disparate Impact Ratio", "Disparate Impact"})
            baseline_bias_score = di_metric["value"] if di_metric else 0.75
            baseline_accuracy = 0.92 
            
            acc_metric = _find_metric(metrics, {"Accuracy"})
            if acc_metric:
                baseline_accuracy = acc_metric["value"]
                
            baseline_bias_magnitude = abs(1 - baseline_bias_score) * 100
            
            strategies = []
            
            # Map complexity based on latency for now
            def get_complexity(latency: int) -> str:
                if latency < 10: return "low"
                if latency < 50: return "medium"
                return "high"
                
            strategy_names = {
                "reweighing": "Reweighing (Pre-processing)",
                "adversarial": "Adversarial Debiasing (In-processing)",
                "dir": "Disparate Impact Remover",
                "equalized_odds": "Calibrated Equalized Odds"
            }
                
            for sid, config in STRATEGIES.items():
                mitigated_bias = baseline_bias_magnitude * config["bias_multiplier"]
                mitigated_acc = (baseline_accuracy + config["accuracy_delta"]) * 100
                
                strategies.append(StrategyInfo(
                    id=sid,
                    name=strategy_names.get(sid, sid.title()),
                    description=f"Simulated technique to reduce bias magnitude by {(1-config['bias_multiplier'])*100:.0f}%.",
                    risk_reduction=float(baseline_bias_magnitude - mitigated_bias),
                    complexity=get_complexity(config["latency_ms"]),
                    metrics_after={
                        "bias_score": float(mitigated_bias),
                        "accuracy": float(mitigated_acc)
                    },
                    python_code=config["code"]
                ))
                
            return MitigateDataResponse(
                strategies=strategies,
                current_metrics={
                    "bias_score": float(baseline_bias_magnitude),
                    "accuracy": float(baseline_accuracy * 100)
                },
                audit_id=audit_id
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch mitigation data for {audit_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch mitigation data",
        )
