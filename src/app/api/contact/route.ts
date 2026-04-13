import { LeadSchema } from '@/types/lead'
import { createServerClient } from '@/lib/supabase/server'
import { getAnthropicClient } from '@/lib/anthropic/client'
import { LEAD_SCORING_SYSTEM_PROMPT } from '@/lib/anthropic/prompts'
import { createGHLContact } from '@/lib/ghl/client'

export async function POST(request: Request) {
  // 1. Parse and validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 }
    )
  }

  const { name, email, company, message } = parsed.data

  // 2. Score lead with Claude
  let aiScore = 50
  let aiSummary = 'Lead received'

  try {
    const anthropic = getAnthropicClient()
    const scoring = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      system: [
        {
          type: 'text',
          text: LEAD_SCORING_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Name: ${name}\nCompany: ${company ?? 'Not specified'}\nMessage: ${message}`,
        },
      ],
    })

    const responseText = scoring.content[0].type === 'text' ? scoring.content[0].text : ''
    const scoreData = JSON.parse(responseText) as { score: number; summary: string }
    aiScore = scoreData.score
    aiSummary = scoreData.summary
  } catch (err) {
    console.error('[Contact] AI scoring failed, using defaults:', err)
  }

  // 3. Insert lead into Supabase
  const supabase = createServerClient()
  const nameParts = name.trim().split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || ''

  const { data: lead, error: dbError } = await supabase
    .from('leads')
    .insert({
      name,
      email,
      company: company ?? null,
      message,
      ai_score: aiScore,
      ai_summary: aiSummary,
    })
    .select()
    .single()

  if (dbError) {
    console.error('[Contact] DB insert failed:', dbError)
    return Response.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  // 4. Create GHL contact (mock or real)
  const ghlResult = await createGHLContact({
    id: lead.id,
    firstName,
    lastName,
    email,
    companyName: company,
    tags: [`score_${aiScore}`, 'portfolio_contact'],
    source: 'Portfolio Website',
  })

  if (ghlResult.success && ghlResult.contactId) {
    await supabase
      .from('leads')
      .update({ ghl_contact_id: ghlResult.contactId })
      .eq('id', lead.id)
  }

  return Response.json({
    success: true,
    message: 'Mensaje recibido. Te contactaré en 24-48 horas.',
    score: aiScore,
  })
}
