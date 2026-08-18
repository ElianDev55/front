import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  CheckoutSnapshot,
  CheckoutStep,
  DeliveryDetails,
  TransactionResult,
} from '../types/checkout'

export interface CheckoutState {
  selectedProductId: string | null
  quantity: number
  step: CheckoutStep
  delivery: DeliveryDetails | null
  payment: CheckoutSnapshot['payment'] | null
  totals: CheckoutSnapshot['totals'] | null
  transaction: TransactionResult | null
}

export const initialCheckoutState: CheckoutState = {
  selectedProductId: null,
  quantity: 1,
  step: 'selection',
  delivery: null,
  payment: null,
  totals: null,
  transaction: null,
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: initialCheckoutState,
  reducers: {
    selectProduct: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload
      state.quantity = 1
      state.step = 'selection'
      state.delivery = null
      state.payment = null
      state.totals = null
      state.transaction = null
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = Math.max(1, action.payload)
    },
    startCheckout: (state) => {
      state.step = 'form'
    },
    updateDeliveryDraft: (state, action: PayloadAction<DeliveryDetails>) => {
      state.delivery = action.payload
    },
    saveCheckoutDetails: (state, action: PayloadAction<CheckoutSnapshot>) => {
      state.delivery = action.payload.delivery
      state.payment = action.payload.payment
      state.totals = action.payload.totals
      state.step = 'summary'
    },
    editCheckout: (state) => {
      state.step = 'form'
    },
    completePayment: (state, action: PayloadAction<TransactionResult>) => {
      state.transaction = action.payload
      state.step = 'result'
    },
    closeCheckout: (state) => {
      state.step = 'selection'
      state.delivery = null
      state.payment = null
      state.totals = null
      state.transaction = null
    },
    resetCheckout: () => initialCheckoutState,
  },
})

export const {
  closeCheckout,
  completePayment,
  editCheckout,
  resetCheckout,
  saveCheckoutDetails,
  selectProduct,
  setQuantity,
  startCheckout,
  updateDeliveryDraft,
} = checkoutSlice.actions

export const checkoutReducer = checkoutSlice.reducer
