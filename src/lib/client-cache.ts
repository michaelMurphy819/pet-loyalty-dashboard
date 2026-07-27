"use client";

// High-performance client-side request deduplication and in-memory session caching.
// Prevents duplicate parallel fetches during component mounting and guarantees instant re-renders when navigating back to existing filter states.

const memoryCache = new Map<string, { data: any; timestamp: number }>();
const pendingRequests = new Map<string, Promise<any>>();
const CLIENT_TTL_MS = 5 * 60 * 1000; // 5 minutes memory TTL in browser

/**
 * Fetch with in-memory caching and promise deduplication
 */
export async function fetchCachedData<T = any>(url: string): Promise<T> {
  const now = Date.now();
  
  // 1. Instantaneous evaluation from existing RAM cache
  const cached = memoryCache.get(url);
  if (cached && (now - cached.timestamp < CLIENT_TTL_MS)) {
    return cached.data as T;
  }

  // 2. Deduplicate parallel simultaneous requests for the exact same query URL
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url) as Promise<T>;
  }

  // 3. Perform network execution and persist payload
  const promise = fetch(url, {
    headers: { 'Accept': 'application/json' },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP fetch error: ${res.status}`);
      const data = await res.json();
      memoryCache.set(url, { data, timestamp: Date.now() });
      return data;
    })
    .finally(() => {
      pendingRequests.delete(url);
    });

  pendingRequests.set(url, promise);
  return promise;
}

/**
 * Optionally prefill or update client cache manually
 */
export function setClientCache(url: string, data: any): void {
  memoryCache.set(url, { data, timestamp: Date.now() });
}
