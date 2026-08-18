import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-subtle text-muted',
  brand: 'bg-brand-soft text-brand-strong',
  success: 'bg-success/10 text-success',
  warning: 'bg-accent/15 text-warning',
  danger: 'bg-danger/10 text-danger',
}

export function Badge({
  children,
  className,
  dot = false,
  variant = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
