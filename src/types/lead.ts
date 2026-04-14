import { z } from 'zod'

export const LeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  message: z.string().min(1, 'Message is required').max(2000),
})

export type LeadInput = z.infer<typeof LeadSchema>

export interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  message: string
  ai_score: number | null
  ai_summary: string | null
  ghl_contact_id: string | null
  status: 'new' | 'contacted' | 'qualified' | 'closed'
  created_at: string
}
