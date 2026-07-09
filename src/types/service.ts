export interface ServiceStep {
  title: string
  description: string
}

export interface Service {
  slug: string
  serviceId: string        // e.g. "SERVICE_01"
  icon: string             // material symbol name
  title: string
  tagline: string
  desc: string             // short description for cards
  stack: string[]
  duration: string
  delivery: string
  steps: ServiceStep[]
  useCases: string[]
  ctaHeadline: string
  accent?: boolean
}
