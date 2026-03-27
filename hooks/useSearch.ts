"use client";

import { useSearchStore } from "@/store/useSearchStore";
import axios from "axios";
import { useEffect, useRef } from "react";

export function useSearch(workspaceId: number) {
  const {
    query,
    results,
    loading,
    error,
    setQuery,
    setResults,
    setLoading,
    setError,
    reset,
  } = useSearchStore();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  async function fetchResults(q: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/workspaces/${workspaceId}/search`, {
        params: { q },
      });
      setResults(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to search");
    } finally {
      setLoading(false);
    }
  }

  return {
    query,
    results,
    loading,
    error,
    setQuery,
    reset,
  };
}