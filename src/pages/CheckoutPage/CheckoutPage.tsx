import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button, Card, CardContent } from '../../components/ui'
import type { CheckoutFormValues, CheckoutPageProps, CheckoutStep } from './checkout.types'
import { calculateCheckoutTotals } from './checkoutPricing'
import { DeliveryForm } from './components/DeliveryForm'
import { OrderSummary } from './components/OrderSummary'
import { PaymentForm } from './components/PaymentForm'
import { PaymentResult } from './components/PaymentResult'

const emptyFormValues: CheckoutFormValues = {
  recipientName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  cardholderName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

export function CheckoutPage({ onBack, onFinish, product, quantity }: CheckoutPageProps) {
  const [step, setStep] = useState<CheckoutStep>('form')
  const [formData, setFormData] = useState<CheckoutFormValues | null>(null)
  const [completedTotals, setCompletedTotals] = useState<ReturnType<
    typeof calculateCheckoutTotals
  > | null>(null)
  const totals = calculateCheckoutTotals(product, quantity)
  const { control, register, handleSubmit, formState } = useForm<CheckoutFormValues>({
    defaultValues: emptyFormValues,
    mode: 'onTouched',
  })
  const cardNumber = useWatch({ control, name: 'cardNumber', defaultValue: '' })
  const stepLabel = step === 'form' ? 'Datos de entrega y pago' : 'Resumen de compra'

  const handleFormSubmit = (values: CheckoutFormValues) => {
    setFormData(values)
    setStep('summary')
  }

  const handleConfirmPayment = () => {
    setCompletedTotals(totals)
    setFormData(null)
    setStep('result')
  }

  const transactionNumber = `LOCAL-${product.id.slice(0, 6).toUpperCase()}-${quantity}`

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
              Paso {step === 'form' ? '2' : step === 'summary' ? '3' : '4'} de 5
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
              {product.name}
            </h2>
            <p className="mt-1 text-sm text-muted">{stepLabel}</p>
          </div>
          {step === 'form' && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              Volver
            </Button>
          )}
        </div>

        {step === 'form' && (
          <form className="space-y-8" onSubmit={handleSubmit(handleFormSubmit)}>
            <DeliveryForm errors={formState.errors} register={register} />
            <PaymentForm
              cardNumber={cardNumber}
              errors={formState.errors}
              register={register}
            />
            <Button fullWidth type="submit">
              Revisar compra
            </Button>
          </form>
        )}

        {step === 'summary' && formData && (
          <OrderSummary
            formData={formData}
            onBack={() => setStep('form')}
            onConfirm={handleConfirmPayment}
            product={product}
            quantity={quantity}
            totals={totals}
          />
        )}

        {step === 'result' && completedTotals && (
          <PaymentResult
            onFinish={onFinish}
            totals={completedTotals}
            transactionNumber={transactionNumber}
          />
        )}
      </CardContent>
    </Card>
  )
}
