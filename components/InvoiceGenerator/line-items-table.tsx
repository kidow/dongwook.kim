import { useCallback } from 'react'
import { PlusIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createEmptyItem } from './constants'
import { formatCurrency } from './utils'

import type { Currency, InvoiceItem } from './types'

interface LineItemsTableProps {
  items: InvoiceItem[]
  currency: Currency
  onItemsChange: (items: InvoiceItem[]) => void
}

export default function LineItemsTable({
  items,
  currency,
  onItemsChange
}: LineItemsTableProps) {
  const handleChange = useCallback(
    (
      id: string,
      field: 'description' | 'quantity' | 'unitPrice',
      value: string
    ) => {
      onItemsChange(
        items.map((item) => {
          if (item.id !== id) return item
          if (field === 'description') {
            return { ...item, description: value }
          }
          const num = Number(value)
          return { ...item, [field]: isNaN(num) ? 0 : num }
        })
      )
    },
    [items, onItemsChange]
  )

  const handleAdd = useCallback(() => {
    onItemsChange([...items, createEmptyItem()])
  }, [items, onItemsChange])

  const handleRemove = useCallback(
    (id: string) => {
      if (items.length <= 1) return
      onItemsChange(items.filter((item) => item.id !== id))
    },
    [items, onItemsChange]
  )

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">항목</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 font-medium">품목</th>
              <th className="w-20 pb-2 text-right font-medium">수량</th>
              <th className="w-28 pb-2 text-right font-medium">단가</th>
              <th className="w-28 pb-2 text-right font-medium">금액</th>
              <th className="w-10 pb-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border">
                <td className="py-1.5 pr-2">
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      handleChange(item.id, 'description', e.target.value)
                    }
                    placeholder="품목명"
                    className="h-8 text-sm"
                  />
                </td>
                <td className="py-1.5 pr-2">
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(item.id, 'quantity', e.target.value)
                    }
                    className="h-8 text-right font-mono text-sm"
                  />
                </td>
                <td className="py-1.5 pr-2">
                  <Input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleChange(item.id, 'unitPrice', e.target.value)
                    }
                    className="h-8 text-right font-mono text-sm"
                  />
                </td>
                <td className="py-1.5 text-right font-mono text-sm tabular-nums">
                  {formatCurrency(item.quantity * item.unitPrice, currency)}
                </td>
                <td className="py-1.5 pl-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemove(item.id)}
                    disabled={items.length <= 1}
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="self-start"
      >
        <PlusIcon className="size-4" />
        항목 추가
      </Button>
    </div>
  )
}
