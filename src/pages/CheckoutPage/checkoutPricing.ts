import type { Product } from '../ProductPage/product.types'
import type { CheckoutTotals } from './checkout.types'

export const BASE_FEE_CENTS = 200000
export const DELIVERY_FEE_CENTS = 800000

export function calculateCheckoutTotals(
  product: Product,
  quantity: number,
): CheckoutTotals {
  const productAmountCents = product.priceCents * quantity

  return {
    productAmountCents,
    baseFeeCents: BASE_FEE_CENTS,
    deliveryFeeCents: DELIVERY_FEE_CENTS,
    totalCents: productAmountCents + BASE_FEE_CENTS + DELIVERY_FEE_CENTS,
  }
}
