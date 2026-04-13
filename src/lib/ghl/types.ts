export interface GHLContact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  companyName?: string
  tags?: string[]
  source?: string
}

export interface GHLCreateContactResult {
  success: boolean
  contactId: string
  message: string
}

export interface GHLWebhookEvent {
  type: 'contact.created' | 'opportunity.stageChange' | 'contact.updated'
  locationId: string
  contactId: string
  data: Record<string, unknown>
}
