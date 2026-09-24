import { cn } from '@/lib/utils'

interface Props extends ReactProps {
  className?: string
}

export default function Container({ children, className }: Props) {
  return (
    <div className={cn('mx-auto w-full max-w-2xl px-4', className)}>
      {children}
    </div>
  )
}
