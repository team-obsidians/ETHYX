// c:\Obsidian\Ethyx\frontend\hooks\useExplainData.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { getAuthToken } from "@/lib/getAuthToken";
import type { ExplainResponse } from "@/types/explain";

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_RETRIES = 90;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ExplainDataState {
  data: ExplainResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useExplainData(auditId: string | null): ExplainDataState {
  const [data, setData] = useState<ExplainResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const retriesRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!auditId) return;

    try {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
      }

      const { token } = await getAuthToken();

      const res = await fetch(`${API_URL}/explain/${auditId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errData = await res
          .json()
          .catch(() => ({ detail: "Failed to fetch explanation data" }));
        throw new Error(errData.detail || `Error: ${res.status}`);
      }

      const json: ExplainResponse = await res.json();
      setData(json);

      if (
        json.audit.status === "completed" ||
        json.audit.status === "failed"
      ) {
        stopPolling();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      stopPolling();
    } finally {
      setLoading(false);
    }
  }, [auditId, stopPolling]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    retriesRef.current = 0;

    intervalRef.current = setInterval(() => {
      retriesRef.current += 1;
      if (retriesRef.current >= MAX_POLL_RETRIES) {
        stopPolling();
        setError("Polling timed out");
        return;
      }
      fetchData();
    }, POLL_INTERVAL_MS);
  }, [fetchData, stopPolling]);

  useEffect(() => {
    if (!auditId) {
      setData(null);
      setLoading(false);
      setError(null);
      stopPolling();
      return;
    }

    setLoading(true);
    fetchData();
  }, [auditId, fetchData, stopPolling]);

  useEffect(() => {
    const auditStatus = data?.audit.status;
    if (
      auditStatus === "uploaded" ||
      auditStatus === "queued" ||
      auditStatus === "analyzing"
    ) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [data?.audit.status, startPolling, stopPolling]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
