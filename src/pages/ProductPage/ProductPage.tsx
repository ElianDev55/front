import { AppShell } from '../../components/layout'
import { Badge, Card, CardContent } from '../../components/ui'
import { products } from '../../mocks/products'
import { CheckoutPage } from '../CheckoutPage'
import {
  selectCheckoutStep,
  selectProduct,
  selectQuantity,
  selectSelectedProductId,
  setQuantity,
  startCheckout,
  useAppDispatch,
  useAppSelector,
} from '../../store'
import { ProductCard } from './components/ProductCard'
import { SelectedProductPanel } from './components/SelectedProductPanel'
import type { Product } from './product.types'

export function ProductPage() {
  const dispatch = useAppDispatch()
  const selectedProductId = useAppSelector(selectSelectedProductId)
  const quantity = useAppSelector(selectQuantity)
  const checkoutStep = useAppSelector(selectCheckoutStep)
  const selectedProduct = products.find(({ id }) => id === selectedProductId)

  const handleSelectProduct = (product: Product) => {
    dispatch(selectProduct(product.id))
  }

  return (
    <AppShell
      sidebar={
        selectedProduct && checkoutStep !== 'selection' ? (
          <CheckoutPage />
        ) : selectedProduct ? (
          <SelectedProductPanel
            product={selectedProduct}
            quantity={quantity}
            onContinue={() => dispatch(startCheckout())}
            onQuantityChange={(value) => dispatch(setQuantity(value))}
          />
        ) : (
          <Card>
            <CardContent className="space-y-4">
              <p className="text-caption font-semibold uppercase tracking-[0.16em] text-brand">
                Tu compra
              </p>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                Selecciona un producto
              </h2>
              <p className="text-sm leading-6 text-muted">
                Elige un producto para ver la cantidad y el resumen de compra aquí.
              </p>
            </CardContent>
          </Card>
        )
      }
    >
      <div className="space-y-8">
        <header className="max-w-2xl">
          <Badge variant="brand" dot>
            Catálogo
          </Badge>
          <h1 className="mt-4 font-display text-display font-semibold tracking-tight">
            Elige lo que quieres llevar
          </h1>
          <p className="mt-4 max-w-xl text-body text-muted">
            Selecciona un producto para revisar disponibilidad y preparar tu compra directa.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={product.id === selectedProductId}
              onSelect={handleSelectProduct}
            />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
