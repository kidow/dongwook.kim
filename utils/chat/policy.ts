import ragPolicy from '@/content/profile/rag-policy.json'

import type { RagPolicy } from '@/utils/chat/types'

export function getRagPolicy(): RagPolicy {
  return ragPolicy as RagPolicy
}

export function detectLanguage(text: string): 'ko' | 'en' {
  const hangulCount = (text.match(/[가-힣]/g) ?? []).length
  const latinCount = (text.match(/[A-Za-z]/g) ?? []).length

  if (latinCount > hangulCount) {
    return 'en'
  }

  return 'ko'
}

export function isInDomainQuestion(query: string, policy: RagPolicy): boolean {
  const normalized = query.toLowerCase()
  const keywords = [...policy.allowedTopics.ko, ...policy.allowedTopics.en]

  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
}

export function getRefusalMessage(lang: 'ko' | 'en', policy: RagPolicy): string {
  return lang === 'en' ? policy.refusal.en : policy.refusal.ko
}

export function getFallbackMessage(lang: 'ko' | 'en', policy: RagPolicy): string {
  return lang === 'en' ? policy.fallback.en : policy.fallback.ko
}
