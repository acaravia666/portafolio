import { projects } from './projects'

export interface CaptureTarget {
  slug: string
  liveUrl: string
  visual: 'screenshot' | 'typographic'
}

export function getCaptureTargets(): CaptureTarget[] {
  return projects
    .filter((p) => p.visual === 'screenshot' && p.liveUrl)
    .map((p) => ({ slug: p.slug, liveUrl: p.liveUrl as string, visual: p.visual }))
}
