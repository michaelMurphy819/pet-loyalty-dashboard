// High-performance server-side in-memory cache for PostgreSQL analytical payloads
// Keeps memory usage clean with TTL expiration and avoids redundant RDS queries on 1.46M+ records.

const serverCache = new Map<string, { data: any; expiry: number }>();

// Clean up expired items periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  serverCache.forEach((val, key) => {
    if (val.expiry <= now) {
      serverCache.delete(key);
    }
  });
}, 60 * 1000).unref?.();

/**
 * Get item from server in-memory cache if valid and not expired
 */
export function getServerCache<T = any>(key: string): T | null {
  const item = serverCache.get(key);
  if (!item) return null;
  if (Date.now() >= item.expiry) {
    serverCache.delete(key);
    return null;
  }
  return item.data as T;
}

/**
 * Store item in server cache with specified TTL in seconds (default: 300 seconds / 5 minutes)
 */
export function setServerCache(key: string, data: any, ttlSeconds: number = 300): void {
  serverCache.set(key, {
    data,
    expiry: Date.now() + (ttlSeconds * 1000),
  });
}

/**
 * Returns optimal HTTP cache headers for edge routers, Next.js CDN, and browser cache
 */
export function getHttpCacheHeaders(isHit: boolean = false): Record<string, string> {
  return {
    "Cache-Control": "public, max-age=120, s-maxage=300, stale-while-revalidate=600",
    "X-Analytics-Cache": isHit ? "HIT" : "MISS",
  };
}
