export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface LeadScore {
  score: number
  summary: string
}

export interface AIProvider {
  /** Streams assistant text deltas. */
  streamText(input: { system: string; messages: ChatMessage[]; maxTokens?: number }): AsyncIterable<string>
  /** Returns a structured lead score. */
  scoreLead(input: { system: string; user: string }): Promise<LeadScore>
}

/** Validates a parsed AI response is a well-formed LeadScore, throwing otherwise. */
export function assertLeadScore(value: unknown): LeadScore {
  if (
    typeof value === 'object' && value !== null &&
    typeof (value as LeadScore).score === 'number' &&
    typeof (value as LeadScore).summary === 'string'
  ) {
    return value as LeadScore
  }
  throw new Error('Invalid lead score shape from AI provider')
}
