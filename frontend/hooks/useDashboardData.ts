// c:\Obsidian\Ethyx\frontend\hooks\useDashboardData.ts
// Fetches single audit data via server-side API route with polling support
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import type {
  Audit,
  FairnessResult,
  AuditStatus,
  AuditDetailResponse,
} from "@/types/dashboard";

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_RETRIES = 90;

interface DashboardDataState {
  audit: Audit | null;
  fairnessResult: FairnessResult | null;
  status: AuditStatus | "loading" | "idle" | "timeout";
  isPolling: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(
  auditId: string | null
): DashboardDataState {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [fairnessResult, setFairnessResult] = useState<FairnessResult | null>(null);
  const [status, setStatus] = useState<
    AuditStatus | "loading" | "idle" | "timeout"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const retriesRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAudit = useCallback(async () => {
    if (!auditId) {
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch(`/api/audits/${auditId}`);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Failed to fetch audit" }));
        setError(errData.error ?? "Failed to fetch audit");
        setStatus("failed");
        return;
      }

      const data: AuditDetailResponse = await res.json();
      
      // Adapt backend metrics array to canonical FairnessMetrics object
      let adaptedMetrics: Record<string, number> = {};
      if (data.fairness_results && Array.isArray(data.fairness_results.metrics)) {
        data.fairness_results.metrics.forEach((m: any) => {
          if (m.name === "Disparate Impact Ratio") {
            adaptedMetrics.demographic_parity_ratio = m.value;
          } else if (m.name === "Statistical Parity Difference") {
            adaptedMetrics.demographic_parity_difference = m.value;
          } else {
            // Map other backend names if they exist in the future
            const key = m.name.toLowerCase().replace(/ /g, "_");
            adaptedMetrics[key] = m.value;
          }
        });
        // Override the raw metrics array with our canonical object
        data.fairness_results.metrics = adaptedMetrics as any;
      }
      
      setAudit(data.audit);
      setFairnessResult(data.fairness_results);
      setStatus(data.audit.status as AuditStatus);

      if (data.audit.status === "failed") {
        setError("Analysis failed");
        stopPolling();
      } else if (data.audit.status === "completed") {
        stopPolling();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch audit";
      setError(message);
      setStatus("failed");
    }
  }, [auditId]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;

    retriesRef.current = 0;
    setIsPolling(true);

    intervalRef.current = setInterval(() => {
      retriesRef.current += 1;

      if (retriesRef.current >= MAX_POLL_RETRIES) {
        stopPolling();
        setStatus("timeout");
        setError("Analysis timed out after maximum retries");
        return;
      }

      fetchAudit();
    }, POLL_INTERVAL_MS);
  }, [fetchAudit, stopPolling]);

  useEffect(() => {
    if (!auditId) {
      setStatus("idle");
      setAudit(null);
      setFairnessResult(null);
      setError(null);
      return;
    }

    setStatus("loading");
    fetchAudit();
  }, [auditId, fetchAudit]);

  useEffect(() => {
    if (status === "uploaded" || status === "queued" || status === "analyzing") {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [status, startPolling, stopPolling]);

  return {
    audit,
    fairnessResult,
    status,
    isPolling,
    error,
    refetch: fetchAudit,
  };
}
