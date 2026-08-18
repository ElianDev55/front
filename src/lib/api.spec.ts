import { chargeCheckout, getProducts, prepareCheckout, tokenizeCard } from './api'

describe('local API client', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    globalThis.fetch = fetchMock
  })

  it('maps backend products to frontend products', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(
        JSON.stringify([
          {
            description: 'Lamp',
            id: 'uuid-1',
            name: 'Lamp',
            priceInCents: 8990000,
            reservedQuantity: 2,
            stockQuantity: 5,
          },
        ]),
      ),
    })

    await expect(getProducts()).resolves.toEqual([
      expect.objectContaining({ id: 'uuid-1', priceCents: 8990000, stockQuantity: 3 }),
    ])
  })

  it('tokenizes a card and returns only the provider token metadata', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(
        JSON.stringify({ data: { brand: 'VISA', id: 'tok_test', last_four: '4242' } }),
      ),
    })

    await expect(tokenizeCard({
      cardHolder: 'Test',
      cvc: '123',
      expMonth: '12',
      expYear: '30',
      number: '4242424242424242',
    })).resolves.toMatchObject({ brand: 'visa', lastFour: '4242', paymentToken: 'tok_test' })
  })

  it('sends prepare and charge requests to the local backend', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify({ amountInCents: 1, transactionId: 'tx-1', transactionNumber: 'tx-1', status: 'PENDING', providerReference: null })),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify({ amountInCents: 1, transactionId: 'tx-1', transactionNumber: 'tx-1', status: 'APPROVED', providerReference: 'provider-1' })),
      })

    await prepareCheckout({
      baseFeeInCents: 1,
      currency: 'COP',
      delivery: { address: 'Calle 1', city: 'Bogota', email: 'test@example.com', phone: '300', postalCode: '110111', recipientName: 'Test' },
      deliveryFeeInCents: 1,
      idempotencyKey: 'checkout-test',
      productId: 'uuid-1',
      quantity: 1,
    })
    await chargeCheckout('tx-1', 'tok_test')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1][0]).toContain('/checkout/tx-1/charge')
  })
})
