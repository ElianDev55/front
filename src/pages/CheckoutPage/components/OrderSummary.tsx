import { Badge, Button } from '../../../components/ui'
import { formatCurrency } from '../../../lib/formatCurrency'
import type { Product } from '../../ProductPage/product.types'
import type { DeliveryDetails, PaymentSummary } from '../../../types/checkout'
import type { CheckoutTotals } from '../checkout.types'

interface OrderSummaryProps {
  product: Product
  quantity: number
  delivery: DeliveryDetails
  payment: PaymentSummary
  totals: CheckoutTotals
  onBack: () => void
  onConfirm: () => void
}

export function OrderSummary({
  delivery,
  onBack,
  onConfirm,
  payment,
  product,
  quantity,
  totals,
}: OrderSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-brand">
          Resumen
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold text-ink">
          Revisa tu compra
        </h2>
        <p className="mt-1 text-sm text-muted">
          {quantity} unidad{quantity === 1 ? '' : 'es'} de {product.name}
        </p>
      </div>

      <div className="space-y-3 rounded-control bg-surface-subtle p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted">Producto</span>
          <span className="font-semibold text-ink">{formatCurrency(totals.productAmountCents)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">Tarifa base</span>
          <span className="text-ink">{formatCurrency(totals.baseFeeCents)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">Envío</span>
          <span className="text-ink">{formatCurrency(totals.deliveryFeeCents)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-3 text-base font-semibold">
          <span className="text-ink">Total</span>
          <span className="text-brand-strong">{formatCurrency(totals.totalCents)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink">Entrega</p>
        <p className="text-sm leading-6 text-muted">
          {delivery.recipientName}, {delivery.address}, {delivery.city}
        </p>
        <p className="text-sm text-muted">{delivery.email}</p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-control border border-border p-4">
        <div>
          <p className="text-sm font-semibold text-ink">Tarjeta</p>
          <p className="mt-1 text-sm text-muted">
            {payment.brand === 'unknown' ? 'Tarjeta' : payment.brand.toUpperCase()} ••••{' '}
            {payment.lastFour}
          </p>
        </div>
        <Badge variant="brand">Protegida</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="ghost" onClick={onBack}>
          Editar datos
        </Button>
        <Button onClick={onConfirm}>Confirmar pago</Button>
      </div>
    </div>
  )
}
