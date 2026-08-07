// Lightweight, dependency-free spam heuristics for the contact form.
// These run server-side before any AI/email/DB work so bot submissions never
// reach the inbox. None of them add friction for real users.

export interface SpamCheckInput {
  /** Honeypot field — hidden in the UI, must be empty for a human. */
  website?: string
  /** Milliseconds between the form rendering and the submit. */
  elapsedMs?: number
  name: string
  email: string
  company?: string
  message: string
}

export interface SpamVerdict {
  ok: boolean
  reason?: string
  /**
   * When true, respond with a fake success so bots don't learn they were
   * blocked and keep retrying with variations.
   */
  silent?: boolean
}

/** Minimum plausible time a human takes to fill the form. */
export const MIN_ELAPSED_MS = 2500
/** Token older than this is stale (page left open for hours / replayed). */
export const MAX_ELAPSED_MS = 1000 * 60 * 60 * 2
/** Max links tolerated in the message body. */
export const MAX_MESSAGE_LINKS = 2

const LINK_RE = /https?:\/\/|www\.|\[url|<a\s/gi

export function countLinks(text: string): number {
  const matches = text.match(LINK_RE)
  return matches ? matches.length : 0
}

export function checkSpam(input: SpamCheckInput): SpamVerdict {
  // 1. Honeypot — a real user never sees or fills this field.
  if (input.website && input.website.trim() !== '') {
    return { ok: false, reason: 'honeypot', silent: true }
  }

  // 2. Submission timing — bots submit instantly; stale tokens are replays.
  if (typeof input.elapsedMs === 'number' && Number.isFinite(input.elapsedMs)) {
    if (input.elapsedMs >= 0 && input.elapsedMs < MIN_ELAPSED_MS) {
      return { ok: false, reason: 'too_fast', silent: true }
    }
    if (input.elapsedMs > MAX_ELAPSED_MS) {
      return { ok: false, reason: 'expired', silent: false }
    }
  }

  // 3. URLs in the name or company field are a strong bot signal.
  if (countLinks(input.name) > 0 || countLinks(input.company ?? '') > 0) {
    return { ok: false, reason: 'link_in_identity', silent: true }
  }

  // 4. Link-stuffed or markup-laden messages are almost always spam.
  if (countLinks(input.message) > MAX_MESSAGE_LINKS) {
    return { ok: false, reason: 'too_many_links', silent: true }
  }

  return { ok: true }
}
