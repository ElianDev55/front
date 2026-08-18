import type {
  CheckoutStep,
  DeliveryDetails,
  PaymentSummary,
  TransactionResult,
} from '../types/checkout'
import { initialCheckoutState, type CheckoutState } from './checkoutSlice'

const STORAGE_KEY = 'product-checkout.progress'
const STORAGE_VERSION = 1

type PersistedCheckoutState = Pick<
  CheckoutState,
  | 'selectedProductId'
  | 'quantity'
  | 'step'
  | 'delivery'
  | 'payment'
  | 'totals'
  | 'transaction'
>

interface StoredProgress {
  version: number
  checkout: PersistedCheckoutState
}

function getSessionStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.sessionStorage
  } catch (error) {
    console.error('Unable to access checkout session storage.', error)
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCheckoutStep(value: unknown): value is CheckoutStep {
  return value === 'selection' || value === 'form' || value === 'summary' || value === 'result'
}

function isDeliveryDetails(value: unknown): value is DeliveryDetails {
  if (!isRecord(value)) {
    return false
  }

  return [
    'recipientName',
    'email',
    'phone',
    'address',
    'city',
    'postalCode',
  ].every((key) => typeof value[key] === 'string')
}

function isPaymentSummary(value: unknown): value is PaymentSummary {
  if (!isRecord(value)) {
    return false
  }

  return (
    (value.brand === 'visa' || value.brand === 'mastercard' || value.brand === 'unknown') &&
    typeof value.lastFour === 'string' &&
    /^\d{0,4}$/.test(value.lastFour) &&
    typeof value.paymentToken === 'string' &&
    /^tok_[A-Za-z0-9_-]+$/.test(value.paymentToken)
  )
}

function isTotals(value: unknown): value is NonNullable<CheckoutState['totals']> {
  if (!isRecord(value)) {
    return false
  }

  return [
    'productAmountCents',
    'baseFeeCents',
    'deliveryFeeCents',
    'totalCents',
  ].every((key) => typeof value[key] === 'number' && value[key] >= 0)
}

function isTransaction(value: unknown): value is TransactionResult {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.number === 'string' &&
    (value.status === 'approved' || value.status === 'declined' || value.status === 'unknown') &&
    typeof value.totalCents === 'number' &&
    value.totalCents >= 0 &&
    (value.providerReference === null || typeof value.providerReference === 'string')
  )
}

function isPersistedCheckoutState(value: unknown): value is PersistedCheckoutState {
  if (!isRecord(value)) {
    return false
  }

  return (
    (value.selectedProductId === null || typeof value.selectedProductId === 'string') &&
    typeof value.quantity === 'number' &&
    Number.isInteger(value.quantity) &&
    value.quantity >= 1 &&
    isCheckoutStep(value.step) &&
    (value.delivery === null || isDeliveryDetails(value.delivery)) &&
    (value.payment === null || isPaymentSummary(value.payment)) &&
    (value.totals === null || isTotals(value.totals)) &&
    (value.transaction === null || isTransaction(value.transaction))
  )
}

function toPersistedCheckoutState(state: CheckoutState): PersistedCheckoutState {
  return {
    selectedProductId: state.selectedProductId,
    quantity: state.quantity,
    step: state.step,
    delivery: state.delivery,
    payment: state.payment,
    totals: state.totals,
    transaction: state.transaction,
  }
}

export function loadCheckoutProgress(): CheckoutState {
  const storage = getSessionStorage()

  if (!storage) {
    return initialCheckoutState
  }

  try {
    const rawProgress = storage.getItem(STORAGE_KEY)

    if (!rawProgress) {
      return initialCheckoutState
    }

    const parsedProgress: unknown = JSON.parse(rawProgress)

    if (
      !isRecord(parsedProgress) ||
      parsedProgress.version !== STORAGE_VERSION ||
      !isPersistedCheckoutState(parsedProgress.checkout)
    ) {
      clearCheckoutProgress()
      return initialCheckoutState
    }

    return {
      ...initialCheckoutState,
      ...parsedProgress.checkout,
    }
  } catch (error) {
    console.error('Unable to load checkout progress.', error)
    clearCheckoutProgress()
    return initialCheckoutState
  }
}

export function saveCheckoutProgress(state: CheckoutState) {
  const storage = getSessionStorage()

  if (!storage) {
    return
  }

  const progress: StoredProgress = {
    version: STORAGE_VERSION,
    checkout: toPersistedCheckoutState(state),
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Unable to save checkout progress.', error)
  }
}

export function clearCheckoutProgress() {
  const storage = getSessionStorage()

  if (!storage) {
    return
  }

  try {
    storage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Unable to clear checkout progress.', error)
  }
}

export function hasActiveCheckoutProgress(state: CheckoutState) {
  return state.selectedProductId !== null
}
