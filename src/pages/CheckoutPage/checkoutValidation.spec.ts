import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  isValidCardNumber,
  isValidExpiry,
  onlyDigits,
} from './checkoutValidation'

describe('checkoutValidation', () => {
  it('normalizes and formats card input', () => {
    expect(onlyDigits('4242 4242-abcd')).toBe('42424242')
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242')
    expect(formatExpiry('1230')).toBe('12/30')
  })

  it('detects Visa and Mastercard', () => {
    expect(detectCardBrand('4242 4242 4242 4242')).toBe('visa')
    expect(detectCardBrand('5555 5555 5555 4444')).toBe('mastercard')
    expect(detectCardBrand('9999 9999 9999 9999')).toBe('unknown')
  })

  it('validates card numbers with Luhn and expiry boundaries', () => {
    expect(isValidCardNumber('4242424242424242')).toBe(true)
    expect(isValidCardNumber('4242424242424243')).toBe(false)
    expect(isValidCardNumber('123')).toBe(false)
    expect(isValidExpiry('12/30')).toBe(true)
    expect(isValidExpiry('13/30')).toBe(false)
    expect(isValidExpiry('01/20')).toBe(false)
  })
})
