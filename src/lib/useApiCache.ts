import { useState, useEffect, useRef } from 'react';
import api from './api';

// Simple in-memory cache store
const cacheStore: Record<string, { data: any; timestamp: number }> = {};

interface UseApiCacheOptions {
  /** Time in milliseconds before data is considered stale (default: 5 min) */
  staleTime?: number;
  /** Whether to fetch immediately (default: true) */
  enabled?: boolean;
}

/**
 * Custom hook for API fetching with in-memory caching.
 * Prevents unnecessary re-fetches on navigation/re-render.
 */
export function useApiCache<T = any>(
  key: string,
  url: string,
  options: UseApiCacheOptions = {}
) {
  const { staleTime = 5 * 60 * 1000, enabled = true } = options;
  const [data, setData] = useState<T | null>(() => {
    const cached = cacheStore[key];
    if (cached && Date.now() - cached.timestamp < staleTime) {
      return cached.data;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!cacheStore[key]);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const cached = cacheStore[key];
    if (cached && Date.now() - cached.timestamp < staleTime) {
      // Data is still fresh, use cache
      setData(cached.data);
      setIsLoading(false);
      return;
    }

    // Fetch fresh data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(url);
        if (isMounted.current) {
          const responseData = res.data;
          cacheStore[key] = { data: responseData, timestamp: Date.now() };
          setData(responseData);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted.current) {
          setError(err.message || 'Gagal memuat data');
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [key, url, staleTime, enabled]);

  return { data, isLoading, error };
}

/** Manually invalidate a cache entry */
export function invalidateCache(key: string) {
  delete cacheStore[key];
}

/** Clear all cache */
export function clearAllCache() {
  Object.keys(cacheStore).forEach((k) => delete cacheStore[k]);
}
