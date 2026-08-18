import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '../../../components/ui'
import type { CheckoutFormValues } from '../checkout.types'
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  isValidCardNumber,
  isValidExpiry,
} from '../checkoutValidation'
import { CardBrandLogo } from './CardBrandLogo'

interface PaymentFormProps {
  register: UseFormRegister<CheckoutFormValues>
  errors: FieldErrors<CheckoutFormValues>
  cardNumber: string
}

export function PaymentForm({ cardNumber, errors, register }: PaymentFormProps) {
  const cardNumberField = register('cardNumber', {
    required: 'Ingresa el número de tarjeta.',
    validate: (value) => isValidCardNumber(value) || 'Ingresa un número de tarjeta válido.',
  })
  const expiryField = register('expiry', {
    required: 'Ingresa el vencimiento.',
    validate: (value) => isValidExpiry(value) || 'Ingresa un vencimiento válido.',
  })
  const cardBrand = detectCardBrand(cardNumber)

  return (
    <fieldset className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <legend className="font-display text-lg font-semibold text-ink">
          Datos de pago
        </legend>
        {cardBrand !== 'unknown' && (
          <CardBrandLogo brand={cardBrand} />
        )}
      </div>
      <Input
        {...register('cardholderName', { required: 'Ingresa el nombre del titular.' })}
        label="Nombre del titular"
        autoComplete="cc-name"
        error={errors.cardholderName?.message}
      />
      <Input
        {...cardNumberField}
        label="Número de tarjeta"
        inputMode="numeric"
        autoComplete="cc-number"
        maxLength={23}
        placeholder="0000 0000 0000 0000"
        error={errors.cardNumber?.message}
        onChange={(event) => {
          event.target.value = formatCardNumber(event.target.value)
          void cardNumberField.onChange(event)
        }}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          {...expiryField}
          label="Vencimiento"
          inputMode="numeric"
          autoComplete="cc-exp"
          maxLength={5}
          placeholder="MM/YY"
          error={errors.expiry?.message}
          onChange={(event) => {
            event.target.value = formatExpiry(event.target.value)
            void expiryField.onChange(event)
          }}
        />
        <Input
          {...register('cvv', {
            required: 'Ingresa el código de seguridad.',
            pattern: { value: /^\d{3,4}$/, message: 'Ingresa un código válido.' },
          })}
          label="CVV"
          type="password"
          inputMode="numeric"
          autoComplete="cc-csc"
          maxLength={4}
          error={errors.cvv?.message}
        />
      </div>
      <p className="text-xs leading-5 text-muted">
        Usa datos ficticios con formato válido. No se almacenan en este flujo local.
      </p>
    </fieldset>
  )
}
