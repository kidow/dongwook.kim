import { expect, test } from '@playwright/test'

function ndjson(events: unknown[]) {
  return `${events.map((event) => JSON.stringify(event)).join('\n')}\n`
}

test.describe('chat page', () => {
  test('navigates from home and renders mocked chat response', async ({ page }) => {
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-store'
        },
        body: ndjson([
          {
            type: 'delta',
            text: 'Mocked answer '
          },
          {
            type: 'done',
            citations: ['chunk-1'],
            matchedChunks: 1
          }
        ])
      })
    })

    await page.goto('/')
    const chatbotLink = page.getByRole('link', { name: /AI Chatbot/i })
    await expect(chatbotLink).toBeVisible()
    await chatbotLink.click()

    await expect(page).toHaveURL(/\/chat$/)
    await expect(
      page.getByText(
        '안녕하세요. 이 챗봇은 김동욱의 이력, 프로젝트, 기술 스택, 사이트 정보에 대해서만 답변합니다.'
      )
    ).toBeVisible()

    const suggestion = '이 사이트의 기술 스택은 무엇인가요?'
    await page.getByRole('button', { name: suggestion }).click()
    const textarea = page.getByPlaceholder(
      '이력, 프로젝트, 기술 스택 관련 질문을 입력하세요'
    )
    await expect(textarea).toHaveValue(suggestion)

    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText('Mocked answer')).toBeVisible()
    await expect(page.getByText('chunk-1')).toBeVisible()

    await page.reload()
    await expect(page.getByText(suggestion)).toBeVisible()
    await expect(page.getByText('Mocked answer')).toBeVisible()
  })

  test('shows fallback ui when chat api returns failure', async ({ page }) => {
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false })
      })
    })

    await page.goto('/chat')
    const textarea = page.getByPlaceholder(
      '이력, 프로젝트, 기술 스택 관련 질문을 입력하세요'
    )
    await textarea.fill('테스트 질문')
    await page.getByRole('button', { name: 'Send message' }).click()

    await expect(
      page.getByText('채팅 응답을 처리하는 중 오류가 발생했습니다.')
    ).toBeVisible()
    await expect(
      page.getByText('요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.')
    ).toBeVisible()
  })
})
