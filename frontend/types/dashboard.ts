// c:\Obsidian\Ethyx\frontend\types\dashboard.ts
// TypeScript interfaces for ETHYX AI — aligned with canonical audits/fairness_results schema

export type AuditStatus =
  | "uploaded"
  | "queued"
  | "analyzing"
  | "completed"
  | "failed"
  | "timeout";

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type FairnessRisk = "high" | "medium" | "low";

export function normalizeRiskLevel(value: unknown): RiskLevel {
  const level = String(value ?? "").toLowerCase();

  if (
    level === "low" ||
    level === "medium" ||
    level === "high" ||
    level === "critical"
  ) {
    return level;
  }

  return "high";
}

/**
 * Maps to the `audits` table in Supabase.
 * This is the canonical audit record shape.
 */
export interface Audit {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  blob_path: string;
  row_count: number | null;
  column_count: number | null;
  target_column: string;
  prediction_column: string | null;
  protected_attributes: string[];
  positive_label: string | null;
  task_type: string;
  domain: string;
  strictness: string;
  status: AuditStatus;
  risk_score: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Maps to the `fairness_results` table in Supabase.
 */
export interface FairnessResult {
  id: string;
  audit_id: string;
  user_id: string;
  overall_risk_score: number | null;
  risk_level: unknown;
  metrics: FairnessMetrics;
  group_results: Record<string, unknown> | null;
  warnings: string[] | null;
  recommendations: string[] | null;
  created_at: string;
}

/**
 * Maps to the `audit_events` table in Supabase.
 */
export interface AuditEvent {
  id: string;
  audit_id: string;
  user_id: string;
  event_type: string;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Combined response from /api/audits/[auditId]
 */
export interface AuditDetailResponse {
  audit: Audit;
  fairness_results: FairnessResult | null;
  events: AuditEvent[];
}

export interface FairnessMetrics {
  demographic_parity_ratio?: number;
  demographic_parity_difference?: number;
  selection_rate_gap?: number;
  equal_opportunity_difference?: number;
  false_positive_rate_difference?: number;
  false_negative_rate_difference?: number;
}

export interface PredictionRow {
  id: string;
  entity: string;
  prediction: "approved" | "rejected";
  confidence: number;
  fairness_risk: FairnessRisk;
  shap_values: Record<string, number>;
  counterfactual: Record<string, string | number | boolean>;
}

export interface ApprovalRateEntry {
  male: number;
  female: number;
}

/* ─── Chart data shapes ─── */

export interface GroupImpactDatum {
  group: string;
  disparateImpact: number;
  statisticalParity: number;
  equalOpportunity: number;
}

export interface SelectionRateDatum {
  group: string;
  male: number;
  female: number;
}

export interface RiskBreakdownDatum {
  metric: string;
  value: number;
  threshold: number;
  status: "pass" | "fail";
}

/* ─── Metric display helper ─── */

export interface MetricDisplayConfig {
  key: keyof FairnessMetrics;
  label: string;
  threshold: number;
  direction: "above" | "below";
  description: string;
  format: "ratio" | "difference";
}

export const METRIC_CONFIGS: MetricDisplayConfig[] = [
  {
    key: "demographic_parity_ratio",
    label: "Demographic Parity Ratio",
    threshold: 0.8,
    direction: "above",
    description: "Selection rate ratio between groups (4/5ths rule)",
    format: "ratio",
  },
  {
    key: "demographic_parity_difference",
    label: "Demographic Parity Difference",
    threshold: 0.1,
    direction: "below",
    description: "Difference in positive outcome rates between groups",
    format: "difference",
  },
  {
    key: "selection_rate_gap",
    label: "Selection Rate Gap",
    threshold: 0.1,
    direction: "below",
    description: "Gap in selection rates across demographic groups",
    format: "difference",
  },
  {
    key: "equal_opportunity_difference",
    label: "Equal Opportunity Difference",
    threshold: 0.1,
    direction: "below",
    description: "Difference in true positive rates between groups",
    format: "difference",
  },
  {
    key: "false_positive_rate_difference",
    label: "FPR Difference",
    threshold: 0.1,
    direction: "below",
    description: "Difference in false positive rates",
    format: "difference",
  },
  {
    key: "false_negative_rate_difference",
    label: "FNR Difference",
    threshold: 0.1,
    direction: "below",
    description: "Difference in false negative rates",
    format: "difference",
  },
];

export function getMetricStatus(
  config: MetricDisplayConfig,
  value: number
): "pass" | "fail" {
  if (config.direction === "above") {
    return value >= config.threshold ? "pass" : "fail";
  }
  return Math.abs(value) <= config.threshold ? "pass" : "fail";
}

export function getRiskColor(level: unknown): string {
  switch (normalizeRiskLevel(level)) {
    case "low":
      return "#10B981";
    case "medium":
      return "#F59E0B";
    case "high":
    case "critical":
      return "#EF4444";
  }
}

/**
 * Helper to map legacy status values to canonical ones.
 * Use during transition period only.
 */
export function normalizeStatus(raw: string): AuditStatus {
  const map: Record<string, AuditStatus> = {
    pending: "queued",
    running: "analyzing",
    complete: "completed",
  };
  return (map[raw] ?? raw) as AuditStatus;
}

/* ─── Display-friendly type aliases for view components ─── */

/**
 * Alias used by AuditStatusPanel.
 * Maps to canonical AuditStatus for non-completed states.
 */
export type AnalysisStatus = AuditStatus;

/**
 * Flattened view model combining Audit + FairnessResult data
 * for TechnicalView / ExecutiveView components.
 */
export interface AnalysisResults {
  risk_score: number;
  risk_level: RiskLevel;
  metrics: FairnessMetrics;
  approval_rates: Record<string, { male: number; female: number }>;
  narrative: string | null;
  row_count: number;
  column_count: number;
  missing_value_pct: number;
  domain: string;
  warnings: string[];
  recommendations: string[];
}

/**
 * Bridge function: transforms canonical Audit + FairnessResult
 * into the AnalysisResults shape consumed by view components.
 */
export function toAnalysisResults(
  audit: Audit,
  fr: FairnessResult
): AnalysisResults {
  return {
    risk_score: fr.overall_risk_score ?? 0,
    risk_level: normalizeRiskLevel(fr.risk_level),
    metrics: fr.metrics,
    approval_rates:
      (fr.group_results as Record<string, { male: number; female: number }>) ?? {},
    narrative:
      fr.recommendations && fr.recommendations.length > 0
        ? fr.recommendations.join("\n")
        : null,
    row_count: audit.row_count ?? 0,
    column_count: audit.column_count ?? 0,
    missing_value_pct: 0,
    domain: audit.domain,
    warnings: fr.warnings ?? [],
    recommendations: fr.recommendations ?? [],
  };
}
