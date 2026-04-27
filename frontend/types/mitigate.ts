export interface StrategyConfig {
  id: string;
  name: string;
  category: "Pre-processing" | "In-processing" | "Post-processing";
  description: string;
}

export interface MitigateRequest {
  audit_id: string;
  strategy: string;
}

export interface MitigatedMetrics {
  bias_score: number;
  accuracy: number;
}

export interface MitigateResponse {
  audit_id: string;
  strategy: string;
  status: string;
  baseline_metrics: MitigatedMetrics;
  mitigated_metrics: MitigatedMetrics;
  latency_impact_ms: number;
  python_code: string;
}
