import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button, Modal } from '../../components/ui'
import { products } from '../../mocks/products'
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
import { detectCardBrand, onlyDigits } from './checkoutValidation'
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

export function CheckoutPage() {
  const dispatch = useAppDispatch()
  const checkout = useAppSelector(selectCheckout)
  const product = products.find(({ id }) => id === checkout.selectedProductId)
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

  const handleFormSubmit = (values: CheckoutFormValues) => {
    if (!totals) {
      return
    }

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
        payment: {
          brand: detectCardBrand(values.cardNumber),
          lastFour: onlyDigits(values.cardNumber).slice(-4),
        },
        totals,
      }),
    )
  }

  const handleConfirmPayment = () => {
    if (!totals) {
      return
    }

    dispatch(
      completePayment({
        number: `LOCAL-${product.id.slice(0, 6).toUpperCase()}-${checkout.quantity}`,
        status: 'approved',
        totalCents: totals.totalCents,
      }),
    )
  }

  const handleFinish = () => {
    dispatch(resetCheckout())
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
              Revisar compra
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
            totals={checkout.totals}
            transactionNumber={checkout.transaction.number}
          />
        )}
    </Modal>
  )
}
