export const dynamic = 'force-dynamic'
export const maxDuration = 30

import { getAnthropicClient } from '@/lib/anthropic/client'
import { CHAT_SYSTEM_PROMPT } from '@/lib/anthropic/prompts'
import { z } from 'zod'

const ChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1).max(2000),
    })
  ).min(1).max(20),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ChatSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid messages format' }, { status: 422 })
  }

  const anthropic = getAnthropicClient()

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: [
      {
        type: 'text',
        text: CHAT_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: parsed.data.messages,
  })

  // Stream text chunks as Server-Sent Events
  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
            controller.enqueue(encoder.encode(chunk))
          }
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
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
