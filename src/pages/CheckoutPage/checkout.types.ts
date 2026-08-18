import type { Product } from '../ProductPage/product.types'

export type CardBrand = 'visa' | 'mastercard' | 'unknown'
export type CheckoutStep = 'form' | 'summary' | 'result'

export interface CheckoutFormValues {
  recipientName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  cardholderName: string
  cardNumber: string
  expiry: string
  cvv: string
}

export interface CheckoutTotals {
  productAmountCents: number
  baseFeeCents: number
  deliveryFeeCents: number
  totalCents: number
}

export interface CheckoutPageProps {
  product: Product
  quantity: number
  onBack: () => void
  onFinish: () => void
}
