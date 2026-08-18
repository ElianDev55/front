export interface HeaderProps {
  brand?: string
}

export function Header({ brand = 'Casa Norte' }: HeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-page py-5 sm:px-8">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-ink">
            {brand}
          </p>
          <p className="mt-0.5 text-caption font-medium uppercase tracking-[0.16em] text-muted">
            Compra directa
          </p>
        </div>
        <p className="hidden text-right text-sm text-muted sm:block">
          Selecciona un producto y paga en un solo paso
        </p>
      </div>
    </header>
  )
}
