import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Header, type HeaderProps } from './Header'

export interface AppShellProps extends HeaderProps {
  children: ReactNode
  sidebar?: ReactNode
}

export function AppShell({ brand, children, sidebar }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header brand={brand} />
      <main className="mx-auto w-full max-w-7xl px-page py-8 sm:px-8 sm:py-10">
        <div
          className={cn(
            'grid items-start gap-8',
            sidebar ? 'lg:grid-cols-[minmax(0,1fr)_22rem]' : undefined,
          )}
        >
          <section className="min-w-0">{children}</section>
          {sidebar && (
            <aside className="min-w-0 lg:sticky lg:top-6">{sidebar}</aside>
          )}
        </div>
      </main>
    </div>
  )
}
