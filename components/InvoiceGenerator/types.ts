export type Currency = 'KRW' | 'USD'

export interface CompanyInfo {
  name: string
  address: string
  email: string
  phone: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: Currency
  taxRate: number
  sender: CompanyInfo
  receiver: CompanyInfo
  items: InvoiceItem[]
  notes: string
}
