export interface Project {
  id: string
  slug: string
  title: string
  description: string | null
  tags: string[]
  cover_url: string | null
  metadata: {
    client?: string
    year?: number
    tech_stack?: string[]
    category?: string
  }
  featured: boolean
  sort_order: number
  created_at: string
}
