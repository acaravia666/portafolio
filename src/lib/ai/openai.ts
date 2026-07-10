import OpenAI from 'openai'
import type { AIProvider, LeadScore } from './types'

let client: OpenAI | null = null
function getClient() {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return client
}

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

export const openaiProvider: AIProvider = {
  async *streamText({ system, messages, maxTokens = 300 }) {
    const stream = await getClient().chat.completions.create({
      model: MODEL,
      max_tokens: maxTokens,
      stream: true,
      messages: [{ role: 'system', content: system }, ...messages],
    })
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) yield delta
    }
  },
  async scoreLead({ system, user }): Promise<LeadScore> {
    const res = await getClient().chat.completions.create({
      model: MODEL,
      max_tokens: 150,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    })
    const text = res.choices[0]?.message?.content ?? '{}'
    return JSON.parse(text) as LeadScore
  },
}
