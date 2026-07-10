import { describe, it, expect } from 'vitest'
import { getCaptureTargets } from './captureTargets'

describe('getCaptureTargets', () => {
  const targets = getCaptureTargets()
  it('only includes projects with a liveUrl and screenshot visual', () => {
    expect(targets.every((t) => t.liveUrl && t.visual === 'screenshot')).toBe(true)
  })
  it('excludes the typographic IRI5 project', () => {
    expect(targets.find((t) => t.slug === 'iri5')).toBeUndefined()
  })
  it('includes qr-shirts', () => {
    expect(targets.find((t) => t.slug === 'qr-shirts')).toBeTruthy()
  })
})
