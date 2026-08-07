import { describe, it, expect } from 'vitest'
import { checkSpam, countLinks, MIN_ELAPSED_MS, MAX_ELAPSED_MS } from './spam'

const base = { name: 'Ana', email: 'ana@acme.com', company: 'Acme', message: 'Quiero una web para mi negocio.' }

describe('countLinks', () => {
  it('counts http, www, bbcode and anchor markers', () => {
    expect(countLinks('see https://a.com and www.b.com')).toBe(2)
    expect(countLinks('[url=x] <a href')).toBe(2)
    expect(countLinks('no links here')).toBe(0)
  })
})

describe('checkSpam', () => {
  it('passes a normal human submission', () => {
    expect(checkSpam({ ...base, elapsedMs: 15000 })).toEqual({ ok: true })
  })

  it('blocks (silently) when the honeypot is filled', () => {
    const v = checkSpam({ ...base, website: 'http://spam.ru', elapsedMs: 15000 })
    expect(v.ok).toBe(false)
    expect(v.reason).toBe('honeypot')
    expect(v.silent).toBe(true)
  })

  it('ignores an empty/whitespace honeypot', () => {
    expect(checkSpam({ ...base, website: '   ', elapsedMs: 15000 }).ok).toBe(true)
  })

  it('blocks (silently) submissions faster than the minimum time', () => {
    const v = checkSpam({ ...base, elapsedMs: MIN_ELAPSED_MS - 1 })
    expect(v.ok).toBe(false)
    expect(v.reason).toBe('too_fast')
    expect(v.silent).toBe(true)
  })

  it('blocks (non-silently) stale/expired submissions', () => {
    const v = checkSpam({ ...base, elapsedMs: MAX_ELAPSED_MS + 1 })
    expect(v.ok).toBe(false)
    expect(v.reason).toBe('expired')
    expect(v.silent).toBeFalsy()
  })

  it('skips timing checks when elapsedMs is absent', () => {
    expect(checkSpam(base).ok).toBe(true)
  })

  it('blocks a URL in the name field', () => {
    expect(checkSpam({ ...base, name: 'buy now http://x.com', elapsedMs: 15000 }).reason).toBe('link_in_identity')
  })

  it('blocks a URL in the company field', () => {
    expect(checkSpam({ ...base, company: 'www.casino.io', elapsedMs: 15000 }).reason).toBe('link_in_identity')
  })

  it('allows up to two links in the message', () => {
    expect(checkSpam({ ...base, message: 'ref https://a.com y https://b.com', elapsedMs: 15000 }).ok).toBe(true)
  })

  it('blocks three or more links in the message', () => {
    const v = checkSpam({ ...base, message: 'https://a.com https://b.com https://c.com', elapsedMs: 15000 })
    expect(v.ok).toBe(false)
    expect(v.reason).toBe('too_many_links')
  })
})
