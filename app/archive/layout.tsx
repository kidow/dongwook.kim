import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <section className="mx-auto w-full max-w-4xl">{children}</section>
}
