# c:\Obsidian\Ethyx\backend\utils\fairness.py
# Fairness metric computation for ETHYX AI
# Dependencies: aif360, pandas, scikit-learn, numpy < 2.0

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger("ethyx.fairness")


@dataclass
class FairnessMetric:
    """A single fairness metric result."""
    name: str
    value: float
    threshold: float
    passed: bool
    description: str


@dataclass
class AnalysisResults:
    """Complete fairness analysis output."""
    overall_score: float
    risk_level: str  # "low" | "medium" | "high" | "critical"
    metrics: list[FairnessMetric] = field(default_factory=list)
    demographic_breakdown: dict[str, Any] = field(default_factory=dict)
    recommendations: list[str] = field(default_factory=list)


async def compute_fairness_metrics(
    dataset_bytes: bytes,
    protected_attribute: str,
    target_column: str,
    positive_label: Any = None,
    *,
    timeout_seconds: int = 300,
) -> AnalysisResults:
    """
    Compute fairness metrics on a CSV dataset.

    Uses AIF360 metrics with a configurable timeout.
    The computation runs in a thread pool to avoid blocking the event loop.

    Args:
        dataset_bytes: Raw CSV file bytes.
        protected_attribute: Column name of the protected attribute (e.g., "gender").
        target_column: Column name of the target/label column.
        timeout_seconds: Maximum seconds before aborting (default 300 = 5 min).

    Returns:
        AnalysisResults with metrics, score, and recommendations.

    Raises:
        asyncio.TimeoutError: If computation exceeds timeout_seconds.
        ValueError: If dataset cannot be parsed or columns are missing.
    """

    def _run_analysis() -> AnalysisResults:
        import pandas as pd
        import numpy as np

        nonlocal positive_label

        # Parse CSV
        from io import BytesIO
        df = pd.read_csv(BytesIO(dataset_bytes))

        # Validate columns exist
        if protected_attribute not in df.columns:
            raise ValueError(
                f"Protected attribute '{protected_attribute}' not found in dataset. "
                f"Available columns: {list(df.columns)}"
            )
        if target_column not in df.columns:
            raise ValueError(
                f"Target column '{target_column}' not found in dataset. "
                f"Available columns: {list(df.columns)}"
            )

        # Identify positive label
        if positive_label is None:
            unique_vals = df[target_column].dropna().unique()
            known_positives = {
                1,
                1.0,
                "1",
                "1.0",
                "yes",
                "true",
                "approved",
                "granted",
                "hired",
                "accepted",
                "selected",
                "select",
                "selection",
                "chosen",
                "recommended",
                "eligible",
                "qualified",
                "success",
                "positive",
                "pass",
                True,
            }
            positive_label = next((val for val in unique_vals if str(val).lower() in known_positives), unique_vals[0])

        # Map labels to 1 (positive) and 0 (negative) to ensure .mean() works on non-numeric targets
        df["_target_numeric"] = (df[target_column].astype(str).str.lower() == str(positive_label).lower()).astype(int)

        # Compute basic fairness metrics
        metrics: list[FairnessMetric] = []

        # Group by protected attribute
        groups = df.groupby(protected_attribute)
        group_rates: dict[str, float] = {}

        for group_name, group_df in groups:
            positive_rate = float(group_df["_target_numeric"].mean())
            group_rates[str(group_name)] = positive_rate

        # Statistical Parity Difference
        if len(group_rates) >= 2:
            rates = list(group_rates.values())
            spd = max(rates) - min(rates)
            metrics.append(FairnessMetric(
                name="Statistical Parity Difference",
                value=round(spd, 4),
                threshold=0.1,
                passed=spd <= 0.1,
                description="Difference in positive outcome rates between groups",
            ))

            # Disparate Impact Ratio
            min_rate = min(rates)
            max_rate = max(rates)
            if max_rate > 0:
                di_ratio = min_rate / max_rate
            else:
                di_ratio = 1.0
            metrics.append(FairnessMetric(
                name="Disparate Impact Ratio",
                value=round(di_ratio, 4),
                threshold=0.8,
                passed=di_ratio >= 0.8,
                description="Ratio of positive outcome rates (min/max). Should be >= 0.8",
            ))

        # Calculate overall score
        if metrics:
            passed_count = sum(1 for m in metrics if m.passed)
            overall_score = round((passed_count / len(metrics)) * 100, 1)
        else:
            overall_score = 0.0

        # Determine risk level
        if overall_score >= 80:
            risk_level = "low"
        elif overall_score >= 60:
            risk_level = "medium"
        elif overall_score >= 40:
            risk_level = "high"
        else:
            risk_level = "critical"

        # Generate recommendations
        recommendations: list[str] = []
        for metric in metrics:
            if not metric.passed:
                recommendations.append(
                    f"Address {metric.name}: current value {metric.value} "
                    f"exceeds threshold {metric.threshold}"
                )

        return AnalysisResults(
            overall_score=overall_score,
            risk_level=risk_level,
            metrics=metrics,
            demographic_breakdown=group_rates,
            recommendations=recommendations,
        )

    return await asyncio.wait_for(
        asyncio.to_thread(_run_analysis),
        timeout=timeout_seconds,
    )
