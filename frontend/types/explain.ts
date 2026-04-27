// c:\Obsidian\Ethyx\frontend\types\explain.ts

export interface AuditMeta {
  id: string;
  file_name: string;
  status: string;
  target_column: string;
  protected_attributes: string[];
  domain?: string;
}

export interface IndividualPrediction {
  id: string;
  entity: string;
  prediction: 'APPROVED' | 'DENIED';
  confidence: number;
  outcome: 'approved' | 'denied';
  fairness_risk: number;
}

export interface ShapContribution {
  feature: string;
  value: number;
}

export interface CounterfactualData {
  current: Record<string, string | number | boolean>;
  suggested: Record<string, string | number | boolean>;
  changed_fields: string[];
  flipped_prediction: 'APPROVED' | 'DENIED';
}

export interface PDPPoint {
  value: string | number;
  impact: number;
}

export interface PDPData {
  feature: string;
  points: PDPPoint[];
}

export interface SelectedExplanation {
  prediction_id: string;
  shap: ShapContribution[];
  counterfactual: CounterfactualData;
  pdp: PDPData[];
}

export interface ExplainResponse {
  audit: AuditMeta;
  rows: IndividualPrediction[];
  selected_explanation: SelectedExplanation | null;
}
