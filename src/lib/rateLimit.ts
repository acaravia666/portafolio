// Best-effort in-memory sliding-window rate limiter.
// NOTE: on serverless (Vercel) this is per-instance, not global, so treat it as
// a burst cap on a warm instance rather than a hard cross-request guarantee.
// For a low-traffic contact form it meaningfully blunts floods without any
// external infrastructure.

const hits = new Map<string, number[]>()

/** Returns true if the key is still within `limit` requests per `windowMs`. */
export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)

  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k)
    }
  }

  return recent.length <= limit
}
