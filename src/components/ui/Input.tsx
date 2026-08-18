import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    className,
    containerClassName,
    error,
    hint,
    id,
    label,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const describedBy = [ariaDescribedBy, error || hint ? messageId : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <input
        {...props}
        ref={ref}
        id={inputId}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : ariaInvalid}
        className={cn(
          'min-h-11 w-full rounded-control border bg-surface px-4 text-body text-ink transition-colors placeholder:text-muted focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-muted',
          error ? 'border-danger' : 'border-border',
          className,
        )}
      />
      {(error || hint) && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={cn('text-sm', error ? 'text-danger' : 'text-muted')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
})
