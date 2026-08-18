import { configureStore } from '@reduxjs/toolkit'
import { checkoutReducer } from './checkoutSlice'
import {
  clearCheckoutProgress,
  hasActiveCheckoutProgress,
  loadCheckoutProgress,
  saveCheckoutProgress,
} from './persistence'

export const store = configureStore({
  reducer: {
    checkout: checkoutReducer,
  },
  preloadedState: {
    checkout: loadCheckoutProgress(),
  },
})

store.subscribe(() => {
  const checkout = store.getState().checkout

  if (hasActiveCheckoutProgress(checkout)) {
    saveCheckoutProgress(checkout)
    return
  }

  clearCheckoutProgress()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
