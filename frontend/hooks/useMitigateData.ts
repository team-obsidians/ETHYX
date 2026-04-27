// c:\Obsidian\Ethyx\frontend\hooks\useMitigateData.ts
"use client";

import { useState, useEffect, useCallback } from "react";

import { getAuthToken } from "@/lib/getAuthToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface MitigateStrategy {
  id: string;
  name: string;
  description: string;
  risk_reduction: number;
  complexity: "low" | "medium" | "high";
  metrics_after: Record<string, number>;
  python_code: string;
}

interface MitigateResponse {
  strategies: MitigateStrategy[];
  current_metrics: Record<string, number>;
  audit_id: string;
}

interface MitigateDataState {
  data: MitigateResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMitigateData(auditId: string | null): MitigateDataState {
  const [data, setData] = useState<MitigateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!auditId) return;

    try {
      setLoading(true);
      setError(null);

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
      }

      const { token } = await getAuthToken();

      const res = await fetch(`${API_URL}/mitigate/${auditId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errData = await res
          .json()
          .catch(() => ({ detail: "Failed to fetch mitigation data" }));
        throw new Error(errData.detail || `Error: ${res.status}`);
      }

      const json: MitigateResponse = await res.json();
      setData(json);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [auditId]);

  useEffect(() => {
    if (!auditId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    fetchData();
  }, [auditId, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
