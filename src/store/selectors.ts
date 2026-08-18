import type { RootState } from './store'

export const selectCheckout = (state: RootState) => state.checkout
export const selectCheckoutStep = (state: RootState) => state.checkout.step
export const selectQuantity = (state: RootState) => state.checkout.quantity
export const selectSelectedProductId = (state: RootState) =>
  state.checkout.selectedProductId
