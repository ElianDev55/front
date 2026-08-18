export type ProductTone = 'mint' | 'sand' | 'sky'

export interface Product {
  id: string
  name: string
  description: string
  priceCents: number
  stockQuantity: number
  tone: ProductTone
}
