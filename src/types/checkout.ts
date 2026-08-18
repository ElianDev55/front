export type CheckoutStep = 'selection' | 'form' | 'summary' | 'result'
export type CardBrand = 'visa' | 'mastercard' | 'unknown'

export interface DeliveryDetails {
  recipientName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export interface PaymentSummary {
  brand: CardBrand
  lastFour: string
  paymentToken: string
}

export interface CheckoutTotals {
  productAmountCents: number
  baseFeeCents: number
  deliveryFeeCents: number
  totalCents: number
}

export interface CheckoutSnapshot {
  delivery: DeliveryDetails
  payment: PaymentSummary
  totals: CheckoutTotals
}

export interface TransactionResult {
  number: string
  status: 'approved' | 'declined' | 'unknown'
  totalCents: number
  providerReference: string | null
}
