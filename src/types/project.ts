export type ProjectStatus = 'live' | 'wip' | 'archived'

export interface ProjectMetric {
  label: string
  value: string
}

export interface Screenshot {
  src: string
  alt: string
  device: 'desktop' | 'mobile'
}

export interface CaseStudy {
  problem: string
  approach: string
  highlights: string[]
  results?: ProjectMetric[]
}

/** How the project renders its visual: real screenshots, or a branded typographic card. */
export type ProjectVisual = 'screenshot' | 'typographic'

export interface Project {
  slug: string
  name: string
  tagline: string
  summary: string
  category: string
  year: number
  role: string
  stack: string[]
  liveUrl?: string
  repoUrl?: string
  status: ProjectStatus
  /** flagship → gets a /work/[slug] case study page */
  featured: boolean
  /** shown as a live <iframe> on the home page */
  heroEmbed?: boolean
  visual: ProjectVisual
  /** brand color used by the typographic card variant */
  accent?: string
  screenshots: Screenshot[]
  caseStudy?: CaseStudy
}
