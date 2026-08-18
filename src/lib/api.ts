import type { Product } from '../pages/ProductPage/product.types'
import type { DeliveryDetails, PaymentSummary } from '../types/checkout'

const apiBaseUrl = (
  typeof __API_BASE_URL__ === 'string' ? __API_BASE_URL__ : 'http://localhost:3000'
).replace(/\/$/, '')
const wompiBaseUrl =
  typeof __WOMPI_API_BASE_URL__ === 'string'
    ? __WOMPI_API_BASE_URL__.replace(/\/$/, '')
    : 'https://api-sandbox.co.uat.wompi.dev/v1'
const wompiPublicKey =
  typeof __WOMPI_PUBLIC_KEY__ === 'string' ? __WOMPI_PUBLIC_KEY__ : undefined

interface ApiProduct {
  id: string
  name: string
  description: string
  priceInCents: number
  stockQuantity: number
  reservedQuantity: number
}

interface CheckoutResponse {
  transactionId: string
  transactionNumber: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'UNKNOWN'
  amountInCents: number
  providerReference: string | null
}

interface CardTokenResponse {
  data?: { id?: string; brand?: string; last_four?: string }
}

export interface CardData {
  number: string
  cvc: string
  expMonth: string
  expYear: string
  cardHolder: string
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  const body = await response.text()
  let parsed: unknown

  try {
    parsed = body ? JSON.parse(body) : {}
  } catch {
    throw new Error('El servidor devolvió una respuesta inválida.')
  }

  if (!response.ok) {
    const message =
      typeof parsed === 'object' && parsed !== null && 'message' in parsed
        ? String(parsed.message)
        : `La solicitud falló (${response.status}).`
    throw new Error(message)
  }

  return parsed as T
}

export async function getProducts(): Promise<Product[]> {
  const products = await request<ApiProduct[]>(`${apiBaseUrl}/products`)
  return products.map((product, index) => ({
    description: product.description,
    id: product.id,
    name: product.name,
    priceCents: product.priceInCents,
    stockQuantity: Math.max(0, product.stockQuantity - product.reservedQuantity),
    tone: (['mint', 'sand', 'sky'] as const)[index % 3],
  }))
}

export async function tokenizeCard(card: CardData): Promise<PaymentSummary & { paymentToken: string }> {
  if (!wompiPublicKey) {
    throw new Error('Falta VITE_WOMPI_PUBLIC_KEY en la configuración del frontend.')
  }

  const response = await request<CardTokenResponse>(`${wompiBaseUrl}/tokens/cards`, {
    body: JSON.stringify({
      card_holder: card.cardHolder,
      cvc: card.cvc,
      exp_month: card.expMonth,
      exp_year: card.expYear,
      number: card.number,
    }),
    headers: {
      Authorization: `Bearer ${wompiPublicKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const token = response.data?.id
  if (!token) {
    throw new Error('Wompi no devolvió un token de tarjeta.')
  }

  return {
    brand: response.data?.brand?.toLowerCase() === 'mastercard' ? 'mastercard' : 'visa',
    lastFour: response.data?.last_four ?? card.number.slice(-4),
    paymentToken: token,
  }
}

export async function prepareCheckout(input: {
  productId: string
  quantity: number
  idempotencyKey: string
  delivery: DeliveryDetails
  baseFeeInCents: number
  deliveryFeeInCents: number
  currency: string
}): Promise<CheckoutResponse> {
  return request<CheckoutResponse>(`${apiBaseUrl}/checkout/prepare`, {
    body: JSON.stringify({
      baseFeeInCents: input.baseFeeInCents,
      currency: input.currency,
      customer: {
        email: input.delivery.email,
        fullName: input.delivery.recipientName,
        phone: input.delivery.phone,
      },
      delivery: {
        addressLine: input.delivery.address,
        city: input.delivery.city,
        country: 'CO',
        postalCode: input.delivery.postalCode,
        recipientName: input.delivery.recipientName,
        state: input.delivery.city,
      },
      deliveryFeeInCents: input.deliveryFeeInCents,
      idempotencyKey: input.idempotencyKey,
      productId: input.productId,
      quantity: input.quantity,
    }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
}

export async function chargeCheckout(
  transactionId: string,
  paymentToken: string,
): Promise<CheckoutResponse> {
  return request<CheckoutResponse>(`${apiBaseUrl}/checkout/${transactionId}/charge`, {
    body: JSON.stringify({
      installments: 1,
      paymentToken,
      personalDataAccepted: true,
      termsAccepted: true,
    }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
}
