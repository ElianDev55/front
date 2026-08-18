import { Badge, Button, Card, CardContent } from '../../../components/ui'
import { formatCurrency } from '../../../lib/formatCurrency'
import type { Product } from '../product.types'
import { QuantitySelector } from './QuantitySelector'

interface SelectedProductPanelProps {
  product: Product
  quantity: number
  onQuantityChange: (quantity: number) => void
  onContinue: () => void
}

export function SelectedProductPanel({
  onContinue,
  onQuantityChange,
  product,
  quantity,
}: SelectedProductPanelProps) {
  const subtotal = product.priceCents * quantity

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <p className="text-caption font-semibold uppercase tracking-[0.16em] text-brand">
            Tu compra
          </p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-muted">Compra directa, sin carrito.</p>
            </div>
            <Badge variant="success" dot>
              Seleccionado
            </Badge>
          </div>
        </div>

        <QuantitySelector
          value={quantity}
          max={product.stockQuantity}
          onChange={onQuantityChange}
        />

        <div className="space-y-3 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-4 text-sm text-muted">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-base font-semibold text-ink">
            <span>Total del producto</span>
            <span className="text-brand-strong">{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <Button fullWidth onClick={onContinue}>
          Pagar con tarjeta
        </Button>
      </CardContent>
    </Card>
  )
}
