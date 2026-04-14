import { LeadSchema } from '@/types/lead'
import { getAnthropicClient } from '@/lib/anthropic/client'
import { LEAD_SCORING_SYSTEM_PROMPT } from '@/lib/anthropic/prompts'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
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

    // 3. Save to Supabase (optional — won't block email if it fails)
    try {
      const { createServerClient } = await import('@/lib/supabase/server')
      const supabase = createServerClient()
      const { error: dbError } = await supabase
        .from('leads')
        .insert({
          name,
          email,
          company: company ?? null,
          message,
          ai_score: aiScore,
          ai_summary: aiSummary,
        })
      if (dbError) {
        console.error('[Contact] DB insert failed:', dbError)
      }
    } catch (err) {
      console.error('[Contact] Supabase unavailable:', err)
    }

    // 4. Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Portfolio <onboarding@resend.dev>',
          to: 'fcaravia420@gmail.com',
          subject: `Nueva consulta [Score: ${aiScore}] — ${name}`,
          html: `
            <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border: 1px solid #000;">
              <h2 style="font-size: 24px; font-weight: 900; text-transform: uppercase; margin: 0 0 24px;">Nuevo Lead — Portfolio</h2>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">NOMBRE</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">EMAIL</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
                ${company ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">EMPRESA</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${company}</td></tr>` : ''}
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">AI SCORE</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: ${aiScore >= 70 ? '#22c55e' : aiScore >= 40 ? '#f59e0b' : '#ef4444'}; font-weight: bold;">${aiScore}/100</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">RESUMEN</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${aiSummary}</td></tr>
              </table>

              <div style="background: #fff; border: 1px solid #000; padding: 16px; margin-bottom: 24px;">
                <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #888; margin-bottom: 8px;">MENSAJE</div>
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>

              <a href="mailto:${email}?subject=Re: Proyecto / Consulta" style="display: inline-block; background: #000; color: #bbe405; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">RESPONDER AHORA →</a>
            </div>
          `,
        })
      } catch (err) {
        console.error('[Contact] Resend email failed:', err)
      }
    }

    return Response.json({
      success: true,
      message: 'Mensaje recibido. Te contactaré en 24-48 horas.',
      score: aiScore,
    })

  } catch (err) {
    console.error('[Contact] Unhandled error:', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
