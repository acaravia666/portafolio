import type { AIProvider } from './types'
import { anthropicProvider } from './anthropic'
import { openaiProvider } from './openai'

export type ProviderName = 'anthropic' | 'openai'

export function selectProviderName(): ProviderName {
  return process.env.AI_PROVIDER === 'openai' ? 'openai' : 'anthropic'
}

export function getAIProvider(): AIProvider {
  return selectProviderName() === 'openai' ? openaiProvider : anthropicProvider
}

export type { AIProvider, ChatMessage, LeadScore } from './types'
