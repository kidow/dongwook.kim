import type { Currency, InvoiceItem } from './types'
import { CURRENCIES } from './constants'

export function formatCurrency(
  amount: number,
  currency: Currency
): string {
  const config = CURRENCIES.find((c) => c.id === currency)
  if (!config) return String(amount)
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.id,
    minimumFractionDigits: currency === 'KRW' ? 0 : 2,
    maximumFractionDigits: currency === 'KRW' ? 0 : 2
  }).format(amount)
}

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
}

export function calculateTax(
  subtotal: number,
  taxRate: number
): number {
  return Math.round(subtotal * (taxRate / 100))
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
