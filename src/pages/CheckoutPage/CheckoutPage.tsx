import { useEffect, useId, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button, Modal } from '../../components/ui'
import { chargeCheckout, prepareCheckout, tokenizeCard } from '../../lib/api'
import {
  closeCheckout,
  completePayment,
  editCheckout,
  resetCheckout,
  saveCheckoutDetails,
  updateDeliveryDraft,
  useAppDispatch,
  useAppSelector,
} from '../../store'
import { selectCheckout } from '../../store/selectors'
import type { DeliveryDetails } from '../../types/checkout'
import type { CheckoutFormValues } from './checkout.types'
import { calculateCheckoutTotals } from './checkoutPricing'
import { onlyDigits } from './checkoutValidation'
import { DeliveryForm } from './components/DeliveryForm'
import { OrderSummary } from './components/OrderSummary'
import { PaymentForm } from './components/PaymentForm'
import { PaymentResult } from './components/PaymentResult'

interface CheckoutPageProps {
  onFinished: () => void
  product: import('../ProductPage/product.types').Product
}

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

export function CheckoutPage({ onFinished, product }: CheckoutPageProps) {
  const dispatch = useAppDispatch()
  const checkout = useAppSelector(selectCheckout)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const idempotencyKey = useRef<string | null>(null)
  const checkoutKey = `checkout-${useId().replaceAll(':', '')}`
  const totals = product
    ? calculateCheckoutTotals(product, checkout.quantity)
    : null
  const { control, register, handleSubmit, formState } = useForm<CheckoutFormValues>({
    defaultValues: {
      ...emptyFormValues,
      ...(checkout.delivery ?? {}),
    },
    mode: 'onTouched',
  })
  const cardNumber = useWatch({ control, name: 'cardNumber', defaultValue: '' })
  const recipientName = useWatch({ control, name: 'recipientName' })
  const email = useWatch({ control, name: 'email' })
  const phone = useWatch({ control, name: 'phone' })
  const address = useWatch({ control, name: 'address' })
  const city = useWatch({ control, name: 'city' })
  const postalCode = useWatch({ control, name: 'postalCode' })

  useEffect(() => {
    if (checkout.step !== 'form') {
      return
    }

    const deliveryDraft: DeliveryDetails = {
      recipientName: recipientName ?? '',
      email: email ?? '',
      phone: phone ?? '',
      address: address ?? '',
      city: city ?? '',
      postalCode: postalCode ?? '',
    }

    if (Object.values(deliveryDraft).some(Boolean)) {
      dispatch(updateDeliveryDraft(deliveryDraft))
    }
  }, [address, city, checkout.step, dispatch, email, phone, postalCode, recipientName])

  if (!product) {
    return null
  }

  const handleFormSubmit = async (values: CheckoutFormValues) => {
    if (!totals) {
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const [month, year] = values.expiry.split('/')
      const payment = await tokenizeCard({
        cardHolder: values.cardholderName,
        cvc: values.cvv,
        expMonth: month,
        expYear: year,
        number: onlyDigits(values.cardNumber),
      })
      dispatch(
        saveCheckoutDetails({
        delivery: {
          recipientName: values.recipientName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
        },
        payment,
        totals,
        }),
      )
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No fue posible tokenizar la tarjeta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmPayment = async () => {
    if (!totals || !checkout.delivery || !checkout.payment) {
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const requestedKey = `checkout-${product.id}-${checkoutKey}`
      idempotencyKey.current ??= requestedKey
      const prepared = await prepareCheckout({
        baseFeeInCents: totals.baseFeeCents,
        currency: 'COP',
        delivery: checkout.delivery,
        deliveryFeeInCents: totals.deliveryFeeCents,
        idempotencyKey: idempotencyKey.current,
        productId: product.id,
        quantity: checkout.quantity,
      })
      const charged = await chargeCheckout(prepared.transactionId, checkout.payment.paymentToken)
      dispatch(
        completePayment({
          number: charged.transactionNumber,
          providerReference: charged.providerReference,
          status: charged.status === 'APPROVED' ? 'approved' : charged.status === 'DECLINED' ? 'declined' : 'unknown',
          totalCents: charged.amountInCents,
        }),
      )
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No fue posible completar el pago.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinish = () => {
    idempotencyKey.current = null
    dispatch(resetCheckout())
    onFinished()
  }

  const stepLabel =
    checkout.step === 'form'
      ? 'Datos de entrega y pago'
      : checkout.step === 'summary'
        ? 'Resumen de compra'
        : 'Resultado'
  const modalTitle =
    checkout.step === 'form'
      ? 'Pagar con tarjeta'
      : checkout.step === 'summary'
        ? 'Revisa tu compra'
        : 'Resultado del pago'
  const stepNumber = checkout.step === 'form' ? '2' : checkout.step === 'summary' ? '3' : '4'

  return (
    <>
      <Modal
        isOpen={checkout.step !== 'selection'}
        title={modalTitle}
        description={`${product.name} · Paso ${stepNumber} de 5 · ${stepLabel}`}
        onClose={() => dispatch(closeCheckout())}
        className="max-w-xl"
      >
        {checkout.step === 'form' && (
          <form className="space-y-8" onSubmit={handleSubmit(handleFormSubmit)}>
            <DeliveryForm errors={formState.errors} register={register} />
            <PaymentForm
              cardNumber={cardNumber}
              errors={formState.errors}
              register={register}
            />
            <Button fullWidth type="submit">
              {isSubmitting ? 'Procesando...' : 'Revisar compra'}
            </Button>
          </form>
        )}

        {checkout.step === 'summary' && checkout.delivery && checkout.payment && checkout.totals && (
          <OrderSummary
            delivery={checkout.delivery}
            onBack={() => dispatch(editCheckout())}
            onConfirm={handleConfirmPayment}
            payment={checkout.payment}
            product={product}
            quantity={checkout.quantity}
            totals={checkout.totals}
          />
        )}

        {checkout.step === 'result' && checkout.transaction && checkout.totals && (
          <PaymentResult
            onFinish={handleFinish}
            status={checkout.transaction.status}
            totals={checkout.totals}
            transactionNumber={checkout.transaction.number}
          />
        )}
      </Modal>
      {error && <p className="fixed bottom-4 left-4 right-4 z-50 rounded-card bg-red-100 p-4 text-sm text-red-800">{error}</p>}
    </>
  )
}
