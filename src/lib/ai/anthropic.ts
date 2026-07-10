import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, LeadScore } from './types'

let client: Anthropic | null = null
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return client
}

// Default model id — verify against the claude-api skill before shipping.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'

export const anthropicProvider: AIProvider = {
  async *streamText({ system, messages, maxTokens = 300 }) {
    const stream = getClient().messages.stream({
      model: MODEL,
      max_tokens: maxTokens,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages,
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text
      }
    }
  },
  async scoreLead({ system, user }): Promise<LeadScore> {
    const res = await getClient().messages.create({
      model: MODEL,
      max_tokens: 150,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: user }],
    })
    const text = res.content[0]?.type === 'text' ? res.content[0].text : ''
    return JSON.parse(text) as LeadScore
  },
}
