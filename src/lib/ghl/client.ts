import type { GHLContact, GHLCreateContactResult } from './types'

// Mock implementation — replace with real GHL API calls when credentials are available
// Real endpoint: https://rest.gohighlevel.com/v1/contacts/
export async function createGHLContact(contact: GHLContact): Promise<GHLCreateContactResult> {
  const apiKey = process.env.GHL_API_KEY

  if (apiKey && apiKey.length > 10) {
    // Real GHL API call (activated when GHL_API_KEY is set)
    const response = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        companyName: contact.companyName,
        tags: contact.tags,
        source: contact.source ?? 'Portfolio Website',
      }),
    })

    if (!response.ok) {
      console.error('[GHL] Failed to create contact:', response.status)
      return { success: false, contactId: '', message: 'GHL API error' }
    }

    const data = (await response.json()) as { contact: { id: string } }
    return { success: true, contactId: data.contact.id, message: 'Contact created' }
  }

  // Mock mode — log what would be sent
  const mockId = `mock_${Date.now()}`
  console.log('[GHL Mock] Would create contact:', { ...contact, mockId })
  return {
    success: true,
    contactId: mockId,
    message: 'Mock: contact logged (set GHL_API_KEY to activate)',
  }
}
