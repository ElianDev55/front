import {
  checkoutReducer,
  completePayment,
  initialCheckoutState,
  resetCheckout,
  saveCheckoutDetails,
  selectProduct,
  setQuantity,
  startCheckout,
} from './checkoutSlice'

describe('checkoutReducer', () => {
  const snapshot = {
    delivery: {
      address: 'Calle 1',
      city: 'Bogota',
      email: 'test@example.com',
      phone: '3001234567',
      postalCode: '110111',
      recipientName: 'Test',
    },
    payment: { brand: 'visa' as const, lastFour: '4242', paymentToken: 'tok_test' },
    totals: {
      baseFeeCents: 200000,
      deliveryFeeCents: 800000,
      productAmountCents: 1000000,
      totalCents: 2000000,
    },
  }

  it('starts a product checkout and clamps quantity', () => {
    let state = checkoutReducer(initialCheckoutState, selectProduct('product-id'))
    state = checkoutReducer(state, setQuantity(0))
    state = checkoutReducer(state, startCheckout())
    expect(state.selectedProductId).toBe('product-id')
    expect(state.quantity).toBe(1)
    expect(state.step).toBe('form')
  })

  it('stores summary and transaction state', () => {
    let state = checkoutReducer(
      { ...initialCheckoutState, selectedProductId: 'product-id' },
      saveCheckoutDetails(snapshot),
    )
    state = checkoutReducer(
      state,
      completePayment({
        number: 'transaction-id',
        providerReference: 'provider-id',
        status: 'approved',
        totalCents: 2000000,
      }),
    )
    expect(state.step).toBe('result')
    expect(state.payment?.paymentToken).toBe('tok_test')
    expect(state.transaction?.number).toBe('transaction-id')
  })

  it('resets all checkout progress', () => {
    const state = checkoutReducer(
      { ...initialCheckoutState, selectedProductId: 'product-id' },
      resetCheckout(),
    )
    expect(state).toEqual(initialCheckoutState)
  })
})
