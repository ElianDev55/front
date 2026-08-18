import { Badge, Button, Card, CardContent } from '../../../components/ui'
import { formatCurrency } from '../../../lib/formatCurrency'
import type { Product, ProductTone } from '../product.types'

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onSelect: (product: Product) => void
}

const toneClasses: Record<ProductTone, string> = {
  mint: 'from-brand-soft to-surface-subtle',
  sand: 'from-surface-subtle to-[#f4e5c8]',
  sky: 'from-[#dce8f0] to-brand-soft',
}

export function ProductCard({ isSelected, onSelect, product }: ProductCardProps) {
  return (
    <Card
      className={[
        'overflow-hidden transition-shadow',
        isSelected ? 'ring-2 ring-brand' : 'hover:shadow-card',
      ].join(' ')}
    >
      <div className={`aspect-[4/3] bg-gradient-to-br ${toneClasses[product.tone]}`} />
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">{product.name}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{product.description}</p>
          </div>
          <Badge variant={product.stockQuantity > 0 ? 'success' : 'danger'} dot>
            {product.stockQuantity > 0 ? 'Disponible' : 'Agotado'}
          </Badge>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-lg font-semibold text-brand-strong">
              {formatCurrency(product.priceCents)}
            </p>
            <p className="mt-1 text-xs text-muted">{product.stockQuantity} unidades</p>
          </div>
          <Button
            size="sm"
            disabled={product.stockQuantity === 0}
            aria-pressed={isSelected}
            onClick={() => onSelect(product)}
          >
            {isSelected ? 'Seleccionado' : 'Seleccionar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
