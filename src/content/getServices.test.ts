import { describe, it, expect } from 'vitest'
import { getAllServices, getServiceBySlug } from './getServices'

describe('service getters', () => {
  it('returns 5 services', () => {
    expect(getAllServices()).toHaveLength(5)
  })
  it('finds a service by slug', () => {
    expect(getServiceBySlug('web-engineering')?.serviceId).toBe('SERVICE_01')
  })
  it('returns undefined for unknown slug', () => {
    expect(getServiceBySlug('nope')).toBeUndefined()
  })
})
