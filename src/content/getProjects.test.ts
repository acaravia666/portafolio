import { describe, it, expect } from 'vitest'
import {
  getAllProjects,
  getFeaturedProjects,
  getShowcaseProjects,
  getProjectBySlug,
  getHeroEmbedProject,
} from './getProjects'

describe('project getters', () => {
  it('returns all projects', () => {
    expect(getAllProjects().length).toBeGreaterThan(0)
  })
  it('featured projects are all featured', () => {
    expect(getFeaturedProjects().every((p) => p.featured)).toBe(true)
  })
  it('showcase projects are all non-featured', () => {
    expect(getShowcaseProjects().every((p) => !p.featured)).toBe(true)
  })
  it('finds a project by slug', () => {
    expect(getProjectBySlug('qr-shirts')?.name).toBe('QR Shirts')
  })
  it('returns undefined for unknown slug', () => {
    expect(getProjectBySlug('nope')).toBeUndefined()
  })
  it('hero embed project has heroEmbed=true', () => {
    expect(getHeroEmbedProject()?.heroEmbed).toBe(true)
  })
})
