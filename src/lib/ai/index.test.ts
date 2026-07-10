import { describe, it, expect, afterEach, vi } from 'vitest'

async function load(provider?: string) {
  vi.resetModules()
  if (provider === undefined) delete process.env.AI_PROVIDER
  else process.env.AI_PROVIDER = provider
  return await import('./index')
}

describe('selectProviderName', () => {
  afterEach(() => { delete process.env.AI_PROVIDER })

  it('defaults to anthropic when unset', async () => {
    const m = await load(undefined)
    expect(m.selectProviderName()).toBe('anthropic')
  })
  it('returns openai when set', async () => {
    const m = await load('openai')
    expect(m.selectProviderName()).toBe('openai')
  })
  it('falls back to anthropic for unknown value', async () => {
    const m = await load('gemini')
    expect(m.selectProviderName()).toBe('anthropic')
  })
})
