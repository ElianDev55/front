import type { CardBrand } from './checkout.types'

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function formatCardNumber(value: string) {
  return onlyDigits(value)
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

export function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function detectCardBrand(value: string): CardBrand {
  const digits = onlyDigits(value)

  if (/^4/.test(digits)) {
    return 'visa'
  }

  if (/^(5[1-5]|2[2-7])/.test(digits)) {
    return 'mastercard'
  }

  return 'unknown'
}

export function isValidCardNumber(value: string) {
  const digits = onlyDigits(value)

  if (digits.length < 13 || digits.length > 19) {
    return false
  }

  let sum = 0
  let shouldDouble = false

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

export function isValidExpiry(value: string) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value)

  if (!match) {
    return false
  }

  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1

  return year > currentYear || (year === currentYear && month >= currentMonth)
}

export function maskCardNumber(value: string) {
  const lastFour = onlyDigits(value).slice(-4)
  return lastFour ? `•••• ${lastFour}` : '••••'
}
