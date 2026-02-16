import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CURRENCIES, TAX_RATES } from './constants'

import type { CompanyInfo, Currency, InvoiceData } from './types'

interface InvoiceFormProps {
  invoice: InvoiceData
  onUpdate: (partial: Partial<InvoiceData>) => void
  onSenderUpdate: (partial: Partial<CompanyInfo>) => void
  onReceiverUpdate: (partial: Partial<CompanyInfo>) => void
}

function Field({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

function CompanyFields({
  title,
  info,
  onInfoUpdate
}: {
  title: string
  info: CompanyInfo
  onInfoUpdate: (partial: Partial<CompanyInfo>) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <Field label="회사명">
        <Input
          value={info.name}
          onChange={(e) => onInfoUpdate({ name: e.target.value })}
          placeholder="회사명"
        />
      </Field>
      <Field label="주소">
        <Input
          value={info.address}
          onChange={(e) => onInfoUpdate({ address: e.target.value })}
          placeholder="주소"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="이메일">
          <Input
            type="email"
            value={info.email}
            onChange={(e) => onInfoUpdate({ email: e.target.value })}
            placeholder="email@example.com"
          />
        </Field>
        <Field label="전화번호">
          <Input
            value={info.phone}
            onChange={(e) => onInfoUpdate({ phone: e.target.value })}
            placeholder="010-0000-0000"
          />
        </Field>
      </div>
    </div>
  )
}

export default function InvoiceForm({
  invoice,
  onUpdate,
  onSenderUpdate,
  onReceiverUpdate
}: InvoiceFormProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Invoice Metadata */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">인보이스 정보</h3>
        <Field label="인보이스 번호">
          <Input
            value={invoice.invoiceNumber}
            onChange={(e) =>
              onUpdate({ invoiceNumber: e.target.value })
            }
            placeholder="INV-001"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="발행일">
            <Input
              type="date"
              value={invoice.issueDate}
              onChange={(e) =>
                onUpdate({ issueDate: e.target.value })
              }
            />
          </Field>
          <Field label="만기일">
            <Input
              type="date"
              value={invoice.dueDate}
              onChange={(e) =>
                onUpdate({ dueDate: e.target.value })
              }
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="통화">
            <Select
              value={invoice.currency}
              onValueChange={(v) =>
                onUpdate({ currency: v as Currency })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="세율">
            <Select
              value={String(invoice.taxRate)}
              onValueChange={(v) =>
                onUpdate({ taxRate: Number(v) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TAX_RATES.map((rate) => (
                  <SelectItem key={rate} value={String(rate)}>
                    {rate}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {/* Sender / Receiver */}
      <CompanyFields
        title="발신자 (From)"
        info={invoice.sender}
        onInfoUpdate={onSenderUpdate}
      />
      <CompanyFields
        title="수신자 (To)"
        info={invoice.receiver}
        onInfoUpdate={onReceiverUpdate}
      />

      {/* Notes */}
      <Field label="비고">
        <Textarea
          value={invoice.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="결제 조건, 참고 사항 등"
          rows={3}
        />
      </Field>
    </div>
  )
}
