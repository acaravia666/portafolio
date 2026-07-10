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
