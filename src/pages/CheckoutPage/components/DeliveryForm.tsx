import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '../../../components/ui'
import type { CheckoutFormValues } from '../checkout.types'

interface DeliveryFormProps {
  register: UseFormRegister<CheckoutFormValues>
  errors: FieldErrors<CheckoutFormValues>
}

export function DeliveryForm({ errors, register }: DeliveryFormProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-display text-lg font-semibold text-ink">
        Datos de entrega
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          {...register('recipientName', { required: 'Ingresa el nombre del destinatario.' })}
          label="Nombre completo"
          autoComplete="name"
          error={errors.recipientName?.message}
        />
        <Input
          {...register('phone', {
            required: 'Ingresa un teléfono.',
            minLength: { value: 7, message: 'Ingresa un teléfono válido.' },
          })}
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
        />
      </div>
      <Input
        {...register('email', {
          required: 'Ingresa un correo electrónico.',
          pattern: { value: /\S+@\S+\.\S+/, message: 'Ingresa un correo válido.' },
        })}
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
      />
      <Input
        {...register('address', { required: 'Ingresa la dirección de entrega.' })}
        label="Dirección"
        autoComplete="street-address"
        error={errors.address?.message}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          {...register('city', { required: 'Ingresa la ciudad.' })}
          label="Ciudad"
          autoComplete="address-level2"
          error={errors.city?.message}
        />
        <Input
          {...register('postalCode', {
            required: 'Ingresa el código postal.',
            minLength: { value: 4, message: 'Ingresa un código postal válido.' },
          })}
          label="Código postal"
          inputMode="numeric"
          autoComplete="postal-code"
          error={errors.postalCode?.message}
        />
      </div>
    </fieldset>
  )
}
