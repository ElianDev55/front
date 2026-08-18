import { AppShell } from '../components/layout'
import { Badge, Button, Card, CardContent } from '../components/ui'

const productPlaceholders = [
  { name: 'Producto destacado', price: '$ 89.900', tone: 'from-brand-soft to-surface-subtle' },
  { name: 'Favorito de la tienda', price: '$ 129.900', tone: 'from-surface-subtle to-[#f4e5c8]' },
  { name: 'Nueva colección', price: '$ 159.900', tone: 'from-[#dce8f0] to-brand-soft' },
]

function App() {
  return (
    <AppShell
      sidebar={
        <Card>
          <CardContent className="space-y-5">
            <div>
              <p className="text-caption font-semibold uppercase tracking-[0.16em] text-brand">
                Tu compra
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
                Selecciona un producto
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Aquí aparecerán la cantidad, el resumen y el formulario de pago.
              </p>
            </div>
            <div className="rounded-control bg-surface-subtle p-4 text-sm leading-6 text-muted">
              Checkout directo, sin carrito y sin autenticación.
            </div>
            <Button fullWidth disabled>
              Continuar al pago
            </Button>
          </CardContent>
        </Card>
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
          {productPlaceholders.map((product) => (
            <Card key={product.name} className="overflow-hidden">
              <div className={`aspect-[4/3] bg-gradient-to-br ${product.tone}`} />
              <CardContent className="space-y-4">
                <div>
                  <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                    Disponible
                  </p>
                  <h2 className="mt-2 font-display text-lg font-semibold text-ink">
                    {product.name}
                  </h2>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-lg font-semibold text-brand-strong">
                    {product.price}
                  </p>
                  <Button size="sm" disabled>
                    Seleccionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

export default App
