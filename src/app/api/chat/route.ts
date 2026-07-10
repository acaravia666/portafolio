export const dynamic = 'force-dynamic'
export const maxDuration = 30

import { getAIProvider } from '@/lib/ai'
import { CHAT_SYSTEM_PROMPT } from '@/lib/anthropic/prompts'
import { z } from 'zod'

const ChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000),
  })).min(1).max(20),
})

export async function POST(request: Request) {
  let body: unknown
  try { body = await request.json() } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = ChatSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Invalid messages format' }, { status: 422 })

  const provider = getAIProvider()
  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const text of provider.streamText({ system: CHAT_SYSTEM_PROMPT, messages: parsed.data.messages })) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        console.error('[Chat] Stream error:', err)
        controller.enqueue(encoder.encode('data: [ERROR]\n\n'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  })
}
