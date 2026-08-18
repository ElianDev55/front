import type { CardBrand } from '../../../types/checkout'

interface CardBrandLogoProps {
  brand: Exclude<CardBrand, 'unknown'>
}

const logoSources = {
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
  visa: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Visa_Inc._logo_%282005%E2%80%932014%29.png',
} as const

export function CardBrandLogo({ brand }: CardBrandLogoProps) {
  return (
    <img
      src={logoSources[brand]}
      alt={brand === 'visa' ? 'Visa' : 'Mastercard'}
      width={brand === 'visa' ? 72 : 56}
      height={28}
      loading="lazy"
      decoding="async"
      className="h-7 w-auto max-w-20 object-contain"
    />
  )
}
