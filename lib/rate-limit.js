// lib/rate-limit.js
// Fixed-window, in-memory rate limiter shared by the API routes.
// NOTE: state lives in the current server instance only. On serverless or multi-instance
// deployments each instance keeps its own counters — move this to Redis/Upstash for strict limits.

/**
 * @param {{ windowMs: number, max: number, maxKeys?: number }} options
 */
export function createRateLimiter({ windowMs, max, maxKeys = 10000 }) {
  // key -> { count, resetAt }
  const store = new Map();

  function getRecord(key, now) {
    const record = store.get(key);
    if (record && now >= record.resetAt) {
      store.delete(key);
      return null;
    }
    return record || null;
  }

  // Bound memory: drop expired entries, then the oldest ones (Map keeps insertion order).
  function prune(now) {
    if (store.size < maxKeys) return;
    for (const [key, record] of store) {
      if (now >= record.resetAt) store.delete(key);
    }
    for (const key of store.keys()) {
      if (store.size < maxKeys) break;
      store.delete(key);
    }
  }

  function toResult(record, now) {
    const count = record ? record.count : 0;
    return {
      limited: count >= max,
      remaining: Math.max(0, max - count),
      retryAfterMs: record ? Math.max(0, record.resetAt - now) : 0
    };
  }

  return {
    /** Read the current state for a key without counting a hit. */
    check(key) {
      const now = Date.now();
      return toResult(getRecord(key, now), now);
    },

    /** Count one hit against a key and return the updated state. */
    hit(key) {
      const now = Date.now();
      let record = getRecord(key, now);
      if (!record) {
        prune(now);
        record = { count: 0, resetAt: now + windowMs };
        store.set(key, record);
      }
      record.count += 1;
      return toResult(record, now);
    },

    reset(key) {
      store.delete(key);
    }
  };
}

/**
 * Best-effort client IP. Platforms such as Vercel set x-real-ip / x-forwarded-for themselves;
 * behind other proxies these headers may be client-controlled, so never rely on per-IP limits alone.
 */
export function getClientIp(request) {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export function retryAfterMinutes(ms) {
  return Math.max(1, Math.ceil(ms / 60000));
}
