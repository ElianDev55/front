import type { Product } from '../ProductPage/product.types'

export type { CardBrand, CheckoutStep, CheckoutTotals } from '../../types/checkout'

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

export interface CheckoutPageProps {
  product: Product
  quantity: number
  onBack: () => void
  onFinish: () => void
}
