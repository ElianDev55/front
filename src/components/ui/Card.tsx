import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type CardTone = 'default' | 'subtle'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone
}

const toneClasses: Record<CardTone, string> = {
  default: 'bg-surface shadow-card',
  subtle: 'bg-surface-subtle',
}

export function Card({ className, tone = 'default', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn('rounded-card ring-1 ring-border', toneClasses[tone], className)}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-6 pb-0 sm:p-8 sm:pb-0', className)} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-6 sm:p-8', className)} />
}
