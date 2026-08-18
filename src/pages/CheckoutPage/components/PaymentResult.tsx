import { Badge, Button } from '../../../components/ui'
import { formatCurrency } from '../../../lib/formatCurrency'
import type { CheckoutTotals } from '../checkout.types'

interface PaymentResultProps {
  transactionNumber: string
  totals: CheckoutTotals
  onFinish: () => void
}

export function PaymentResult({ onFinish, totals, transactionNumber }: PaymentResultProps) {
  return (
    <div className="space-y-6 text-center">
      <Badge variant="success" dot>
        Pago aprobado
      </Badge>
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          ¡Compra confirmada!
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Este resultado es local y simula la confirmación del pago.
        </p>
      </div>
      <div className="rounded-card bg-brand-soft p-5">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-brand-strong">
          Número de transacción
        </p>
        <p className="mt-2 font-mono text-lg font-semibold text-brand-strong">
          {transactionNumber}
        </p>
        <p className="mt-3 text-sm text-brand-strong">
          Total: {formatCurrency(totals.totalCents)}
        </p>
      </div>
      <Button fullWidth onClick={onFinish}>
        Volver al catálogo
      </Button>
    </div>
  )
}
