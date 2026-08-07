import { describe, it, expect } from 'vitest'
import { rateLimit } from './rateLimit'

describe('rateLimit', () => {
  it('allows up to the limit then blocks within the window', () => {
    const key = `test-${Math.random()}`
    const results = Array.from({ length: 6 }, () => rateLimit(key, 5, 60_000))
    expect(results.slice(0, 5).every(Boolean)).toBe(true) // first 5 allowed
    expect(results[5]).toBe(false) // 6th blocked
  })

  it('tracks keys independently', () => {
    expect(rateLimit(`a-${Math.random()}`, 1)).toBe(true)
    expect(rateLimit(`b-${Math.random()}`, 1)).toBe(true)
  })
})
