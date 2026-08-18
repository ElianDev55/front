import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface StepDefinition {
  label: string
  description?: string
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: StepDefinition[]
  activeStep: number
}

export function Stepper({ activeStep, className, steps, ...props }: StepperProps) {
  return (
    <ol
      {...props}
      aria-label={props['aria-label'] ?? 'Progreso del checkout'}
      className={cn('grid grid-cols-5 gap-1', className)}
    >
      {steps.map((step, index) => {
        const isComplete = index < activeStep
        const isCurrent = index === activeStep

        return (
          <li key={step.label} className="relative min-w-0 text-center">
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-1/2 right-[-50%] top-4 h-0.5 -translate-y-1/2',
                  isComplete ? 'bg-brand' : 'bg-border',
                )}
              />
            )}
            <span
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'relative z-10 mx-auto flex size-8 items-center justify-center rounded-full border text-xs font-bold transition-colors',
                isComplete && 'border-brand bg-brand text-white',
                isCurrent && 'border-brand bg-brand-soft text-brand-strong ring-4 ring-brand-soft',
                !isComplete && !isCurrent && 'border-border bg-surface text-muted',
              )}
              title={step.description}
            >
              {isComplete ? '✓' : index + 1}
            </span>
            <span
              className={cn(
                'mt-2 block truncate text-[0.65rem] font-semibold leading-tight',
                isCurrent || isComplete ? 'text-brand-strong' : 'text-muted',
              )}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
