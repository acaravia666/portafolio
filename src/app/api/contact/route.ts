export const dynamic = 'force-dynamic'
export const maxDuration = 30

import { LeadSchema } from '@/types/lead'
import { getAIProvider } from '@/lib/ai'
import { LEAD_SCORING_SYSTEM_PROMPT } from '@/lib/anthropic/prompts'
import { Resend } from 'resend'
import { z } from 'zod'
import { checkSpam } from '@/lib/spam'
import { rateLimit } from '@/lib/rateLimit'

// Contact payload = lead fields + two anti-spam fields the client attaches.
const ContactSchema = LeadSchema.extend({
  website: z.string().max(200).optional(), // honeypot — hidden, must be empty
  ts: z.number().optional(),               // epoch ms when the form rendered
})

export async function POST(request: Request) {
  try {
    // 1. Parse and validate body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = ContactSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { name, email, company, message, website, ts } = parsed.data

    // 1b. Anti-spam gate — runs before any AI / DB / email work.
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    if (!rateLimit(`contact:${ip}`)) {
      return Response.json(
        { error: 'Demasiados envíos. Espera un momento e intenta de nuevo.' },
        { status: 429 }
      )
    }

    const verdict = checkSpam({
      website,
      elapsedMs: typeof ts === 'number' ? Date.now() - ts : undefined,
      name,
      email,
      company,
      message,
    })
    if (!verdict.ok) {
      console.warn('[Contact] blocked as spam:', verdict.reason, 'ip=', ip)
      if (verdict.silent) {
        // Fake success so bots don't adapt; nothing is stored or emailed.
        return Response.json({
          success: true,
          message: 'Mensaje recibido. Te contactaré en 24-48 horas.',
          score: 0,
        })
      }
      return Response.json(
        { error: 'No se pudo enviar. Recarga la página e intenta de nuevo.' },
        { status: 400 }
      )
    }

    // 2. Score lead via the configured AI provider
    let aiScore = 50
    let aiSummary = 'Lead received'
    try {
      const provider = getAIProvider()
      const result = await provider.scoreLead({
        system: LEAD_SCORING_SYSTEM_PROMPT,
        user: `Name: ${name}\nCompany: ${company ?? 'Not specified'}\nMessage: ${message}`,
      })
      aiScore = result.score
      aiSummary = result.summary
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
