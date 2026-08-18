const currencyFormatter = new Intl.NumberFormat('es-CO', {
  currency: 'COP',
  maximumFractionDigits: 0,
  style: 'currency',
})

export function formatCurrency(amountInCents: number) {
  return currencyFormatter.format(amountInCents / 100)
}
