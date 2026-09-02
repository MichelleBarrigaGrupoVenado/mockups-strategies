import type { ProductLevel } from '@/features/strategies/data/product-hierarchy'
import { ProductUnitType } from '@/features/strategies/types'

export { ProductUnitType }

export const PointsItemType = {
  Product: 'product',
  External: 'external',
} as const
export type PointsItemType = (typeof PointsItemType)[keyof typeof PointsItemType]

export const PointsItemStatus = {
  Active: 'active',
  Inactive: 'inactive',
} as const
export type PointsItemStatus = (typeof PointsItemStatus)[keyof typeof PointsItemStatus]

export const VigencyType = {
  Permanent: 'permanent',
  WithEndDate: 'with_end_date',
} as const
export type VigencyType = (typeof VigencyType)[keyof typeof VigencyType]

export const ExternalItemCategory = {
  Electrodomesticos: 'electrodomesticos',
  Tecnologia: 'tecnologia',
  Vales: 'vales',
} as const
export type ExternalItemCategory = (typeof ExternalItemCategory)[keyof typeof ExternalItemCategory]

export const externalItemCategoryOptions: { value: ExternalItemCategory; label: string }[] = [
  { value: ExternalItemCategory.Electrodomesticos, label: 'Electrodomésticos' },
  { value: ExternalItemCategory.Tecnologia, label: 'Tecnología' },
  { value: ExternalItemCategory.Vales, label: 'Vales' },
]

export interface PointsItem {
  id: string
  code: string
  name: string
  description?: string
  type: PointsItemType
  categoryLabel: string
  imageUrl?: string
  points: number
  unitType?: ProductUnitType
  productLevel?: ProductLevel | ''
  productLevelValue?: string
  productId?: string
  externalCategory?: ExternalItemCategory
  vigency: VigencyType
  startDate?: string
  endDate?: string
  status: PointsItemStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface PointsItemFormValues {
  type: PointsItemType
  productLevel: ProductLevel | ''
  productLevelValue: string
  productId: string
  unitType: ProductUnitType
  name: string
  description: string
  externalCategory: ExternalItemCategory | ''
  externalCode: string
  imageUrl: string
  points: number
  status: PointsItemStatus
  vigency: VigencyType
  startDate: string
  endDate: string
}
