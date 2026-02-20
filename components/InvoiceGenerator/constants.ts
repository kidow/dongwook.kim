import type { Currency, InvoiceData, InvoiceItem } from './types'

export const CURRENCIES: {
  id: Currency
  label: string
  symbol: string
  locale: string
}[] = [
  { id: 'KRW', label: '원 (KRW)', symbol: '₩', locale: 'ko-KR' },
  { id: 'USD', label: 'Dollar (USD)', symbol: '$', locale: 'en-US' }
]

export const TAX_RATES = [0, 5, 10, 15, 20]

export function createEmptyItem(): InvoiceItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unitPrice: 0
  }
}

export function createDefaultInvoice(): InvoiceData {
  const today = new Date().toISOString().slice(0, 10)
  const due = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  return {
    invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
    issueDate: today,
    dueDate: due,
    currency: 'KRW',
    taxRate: 10,
    sender: { name: '', address: '', email: '', phone: '' },
    receiver: { name: '', address: '', email: '', phone: '' },
    items: [createEmptyItem()],
    notes: ''
  }
}
