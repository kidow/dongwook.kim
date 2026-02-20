import {
  detectLanguage,
  getFallbackMessage,
  getRefusalMessage,
  isInDomainQuestion
} from '@/utils/chat/policy'
import type { RagPolicy } from '@/utils/chat/types'

const policy: RagPolicy = {
  allowedTopics: {
    ko: ['이력', '프로젝트'],
    en: ['resume', 'project']
  },
  refusal: {
    ko: '거절 메시지',
    en: 'Refusal message'
  },
  fallback: {
    ko: '폴백 메시지',
    en: 'Fallback message'
  },
  style: {
    maxSentences: 3,
    tone: 'brief',
    forbidden: []
  },
  retrieval: {
    scoreThreshold: 0.5,
    topK: 3
  }
}

describe('utils/chat/policy', () => {
  it('detects english when latin letters are dominant', () => {
    expect(detectLanguage('Tell me about your resume 이력')).toBe('en')
  })

  it('detects korean when hangul is dominant or tied', () => {
    expect(detectLanguage('이력과 프로젝트 알려줘')).toBe('ko')
  })

  it('matches in-domain question with allowed topic keyword', () => {
    expect(isInDomainQuestion('Can you summarize your project?', policy)).toBe(true)
    expect(isInDomainQuestion('오늘 날씨 알려줘', policy)).toBe(false)
  })

  it('returns refusal and fallback messages by language', () => {
    expect(getRefusalMessage('ko', policy)).toBe('거절 메시지')
    expect(getRefusalMessage('en', policy)).toBe('Refusal message')
    expect(getFallbackMessage('ko', policy)).toBe('폴백 메시지')
    expect(getFallbackMessage('en', policy)).toBe('Fallback message')
  })
})
