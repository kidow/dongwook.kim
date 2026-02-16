import type { InvoiceData } from './types'
import {
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  formatDate
} from './utils'

interface InvoicePreviewProps {
  invoice: InvoiceData
}

function CompanyBlock({
  label,
  info
}: {
  label: string
  info: InvoiceData['sender']
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-semibold">
        {info.name || <span className="text-muted-foreground">-</span>}
      </p>
      {info.address && (
        <p className="text-sm text-muted-foreground">{info.address}</p>
      )}
      {info.email && (
        <p className="text-sm text-muted-foreground">{info.email}</p>
      )}
      {info.phone && (
        <p className="text-sm text-muted-foreground">{info.phone}</p>
      )}
    </div>
  )
}

export default function InvoicePreview({
  invoice
}: InvoicePreviewProps) {
  const subtotal = calculateSubtotal(invoice.items)
  const tax = calculateTax(subtotal, invoice.taxRate)
  const total = subtotal + tax

  return (
    <div className="invoice-preview rounded-xl border border-border bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold">INVOICE</h2>
        <div className="text-right text-sm">
          <p className="font-mono font-semibold">
            {invoice.invoiceNumber}
          </p>
          <p className="text-muted-foreground">
            발행일: {formatDate(invoice.issueDate)}
          </p>
          <p className="text-muted-foreground">
            만기일: {formatDate(invoice.dueDate)}
          </p>
        </div>
      </div>

      {/* Sender / Receiver */}
      <div className="mt-8 grid grid-cols-2 gap-8">
        <CompanyBlock label="From" info={invoice.sender} />
        <CompanyBlock label="To" info={invoice.receiver} />
      </div>

      {/* Items Table */}
      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b-2 border-foreground">
            <th className="py-2 text-left">#</th>
            <th className="py-2 text-left">품목</th>
            <th className="py-2 text-right">수량</th>
            <th className="py-2 text-right">단가</th>
            <th className="py-2 text-right">금액</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={item.id} className="border-b border-border">
              <td className="py-2 text-muted-foreground">{i + 1}</td>
              <td className="py-2">
                {item.description || (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="py-2 text-right font-mono tabular-nums">
                {item.quantity}
              </td>
              <td className="py-2 text-right font-mono tabular-nums">
                {formatCurrency(item.unitPrice, invoice.currency)}
              </td>
              <td className="py-2 text-right font-mono tabular-nums">
                {formatCurrency(
                  item.quantity * item.unitPrice,
                  invoice.currency
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-4 flex justify-end">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>소계</span>
            <span className="font-mono tabular-nums">
              {formatCurrency(subtotal, invoice.currency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>세금 ({invoice.taxRate}%)</span>
            <span className="font-mono tabular-nums">
              {formatCurrency(tax, invoice.currency)}
            </span>
          </div>
          <div className="flex justify-between border-t-2 border-foreground pt-1 font-bold">
            <span>합계</span>
            <span className="font-mono tabular-nums">
              {formatCurrency(total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-8 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            비고
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  )
}
