import { createServerClient } from '@/lib/supabase/server'
import type { GHLWebhookEvent } from '@/lib/ghl/types'

function verifyGHLSignature(body: string, signature: string, secret: string): boolean {
  // In production: HMAC-SHA256 verification
  // For mock/dev: accept any request with the dev secret header
  if (process.env.NODE_ENV === 'development') return true
  return signature === secret
}

export async function POST(request: Request) {
  const signature = request.headers.get('x-ghl-signature') ?? ''
  const secret = process.env.GHL_WEBHOOK_SECRET ?? ''

  const bodyText = await request.text()

  if (!verifyGHLSignature(bodyText, signature, secret)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: GHLWebhookEvent
  try {
    event = JSON.parse(bodyText) as GHLWebhookEvent
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = createServerClient()

  if (event.type === 'opportunity.stageChange') {
    const { contactId, data } = event
    const newStage = (data.stage as string) ?? 'unknown'

    let status: string
    if (newStage.toLowerCase().includes('qualified')) status = 'qualified'
    else if (newStage.toLowerCase().includes('closed')) status = 'closed'
    else status = 'contacted'

    await supabase
      .from('leads')
      .update({ status })
      .eq('ghl_contact_id', contactId)

    console.log(`[GHL Webhook] Updated lead ${contactId} → ${status}`)
  }

  return Response.json({ received: true })
}
