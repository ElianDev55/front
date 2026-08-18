import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'

export interface ModalProps {
  isOpen: boolean
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
  closeOnOverlayClick?: boolean
  className?: string
}

export function Modal({
  children,
  className,
  closeOnOverlayClick = true,
  description,
  footer,
  isOpen,
  onClose,
  title,
}: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 cursor-default bg-ink/60"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          'relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-border',
          className,
        )}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-6 sm:p-8">
          <div>
            <h2 id={titleId} className="font-display text-xl font-semibold text-ink">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-2 text-sm leading-6 text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Cerrar modal"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-xl text-muted transition-colors hover:bg-surface-subtle hover:text-ink focus:outline-none"
            onClick={onClose}
          >
            <span aria-hidden="true">x</span>
          </button>
        </header>
        <div className="overflow-y-auto p-6 sm:p-8">{children}</div>
        {footer && <footer className="border-t border-border p-6 sm:p-8">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
