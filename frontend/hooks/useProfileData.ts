// c:\Obsidian\Ethyx\frontend\hooks\useProfileData.ts
"use client";

import { useState, useEffect, useCallback } from "react";

import type { ProfileResponse } from "@/types/profile";

interface ProfileDataState {
  data: ProfileResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProfileData(): ProfileDataState {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Uses server-side API route — auth handled via cookie
      const res = await fetch("/api/profile");

      if (!res.ok) {
        const errData = await res
          .json()
          .catch(() => ({ error: "Failed to fetch profile" }));
        throw new Error(errData.error || `Error: ${res.status}`);
      }

      const json: ProfileResponse = await res.json();
      setData(json);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
