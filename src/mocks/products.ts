import type { Product } from '../pages/ProductPage/product.types'

export const products: Product[] = [
  {
    id: 'portable-lamp',
    name: 'Lámpara portátil',
    description: 'Iluminación cálida y compacta para cualquier espacio.',
    priceCents: 8990000,
    stockQuantity: 12,
    tone: 'mint',
  },
  {
    id: 'ceramic-vase',
    name: 'Jarrón de cerámica',
    description: 'Pieza artesanal para darle carácter a tu hogar.',
    priceCents: 12990000,
    stockQuantity: 7,
    tone: 'sand',
  },
  {
    id: 'linen-throw',
    name: 'Manta de lino',
    description: 'Textura ligera y suave para tus momentos de descanso.',
    priceCents: 15990000,
    stockQuantity: 4,
    tone: 'sky',
  },
]
