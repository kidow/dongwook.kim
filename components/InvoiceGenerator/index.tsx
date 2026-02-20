'use client'

import { useCallback, useState } from 'react'
import { PrinterIcon, RotateCcwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { toast } from 'utils'
import InvoiceForm from './invoice-form'
import LineItemsTable from './line-items-table'
import InvoicePreview from './invoice-preview'
import { createDefaultInvoice } from './constants'

import type { CompanyInfo, InvoiceData } from './types'

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<InvoiceData>(createDefaultInvoice)

  const handleUpdate = useCallback((partial: Partial<InvoiceData>) => {
    setInvoice((prev) => ({ ...prev, ...partial }))
  }, [])

  const handleSenderUpdate = useCallback((partial: Partial<CompanyInfo>) => {
    setInvoice((prev) => ({
      ...prev,
      sender: { ...prev.sender, ...partial }
    }))
  }, [])

  const handleReceiverUpdate = useCallback((partial: Partial<CompanyInfo>) => {
    setInvoice((prev) => ({
      ...prev,
      receiver: { ...prev.receiver, ...partial }
    }))
  }, [])

  const handleItemsChange = useCallback((items: InvoiceData['items']) => {
    setInvoice((prev) => ({ ...prev, items }))
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleReset = useCallback(() => {
    setInvoice(createDefaultInvoice())
    toast.info('인보이스가 초기화되었습니다')
  }, [])

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-2 print:hidden">
        <h1 className="text-2xl font-bold">Invoice Generator</h1>
        <p className="text-sm text-muted-foreground">
          인보이스를 작성하고 PDF로 저장하거나 인쇄할 수 있습니다.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-6 print:hidden">
        <InvoiceForm
          invoice={invoice}
          onUpdate={handleUpdate}
          onSenderUpdate={handleSenderUpdate}
          onReceiverUpdate={handleReceiverUpdate}
        />
        <LineItemsTable
          items={invoice.items}
          currency={invoice.currency}
          onItemsChange={handleItemsChange}
        />
        <div className="flex gap-2">
          <Button onClick={handlePrint}>
            <PrinterIcon />
            인쇄 / PDF 저장
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcwIcon />
            초기화
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className="mb-3 text-sm font-semibold print:hidden">미리보기</h3>
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  )
}
