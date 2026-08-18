import { Button } from '../../../components/ui'

export interface QuantitySelectorProps {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
}

export function QuantitySelector({
  max,
  min = 1,
  onChange,
  value,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-ink">Cantidad</p>
        <p className="mt-1 text-xs text-muted">Máximo disponible: {max}</p>
      </div>
      <div
        role="group"
        aria-label="Seleccionar cantidad"
        className="flex items-center gap-2 rounded-control border border-border bg-surface p-1"
      >
        <Button
          variant="ghost"
          size="sm"
          aria-label="Disminuir cantidad"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          -
        </Button>
        <span aria-live="polite" className="min-w-8 text-center font-semibold text-ink">
          {value}
        </span>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Aumentar cantidad"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </Button>
      </div>
    </div>
  )
}
