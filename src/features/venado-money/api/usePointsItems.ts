import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProductBreadcrumb, getProductOptions, productLevelOptions } from '@/features/strategies/data/product-hierarchy'
import { mockPointsItems } from '@/features/venado-money/data/mock-data'
import {
  ExternalItemCategory,
  PointsItemStatus,
  PointsItemType,
  type PointsItem,
  type PointsItemFormValues,
} from '@/features/venado-money/types'

let itemsStore: PointsItem[] = [...mockPointsItems]

const pointsItemsKey = ['venado-money', 'points-items'] as const

async function fakeDelay<T>(value: T, ms = 300): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms))
  return value
}

export interface PointsItemsFilters {
  search?: string
  type?: PointsItemType | ''
  level?: string
  levelValue?: string
  status?: PointsItemStatus | ''
  vigency?: string
}

export function filterPointsItems(filters: PointsItemsFilters): PointsItem[] {
  return itemsStore.filter((item) => {
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase()) && !item.code.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.type && item.type !== filters.type) return false
    if (filters.level && item.productLevel !== filters.level) return false
    if (filters.levelValue && item.productLevelValue !== filters.levelValue) return false
    if (filters.status && item.status !== filters.status) return false
    if (filters.vigency && item.vigency !== filters.vigency) return false
    return true
  })
}

export function usePointsItems(filters: PointsItemsFilters) {
  const queryKey = [
    ...pointsItemsKey,
    filters.search ?? '',
    filters.type ?? '',
    filters.level ?? '',
    filters.levelValue ?? '',
    filters.status ?? '',
    filters.vigency ?? '',
  ] as const

  return useQuery({
    queryKey,
    queryFn: () => fakeDelay(filterPointsItems(filters), 250),
  })
}

export function usePointsItem(id: string | undefined) {
  return useQuery({
    queryKey: [...pointsItemsKey, 'detail', id ?? ''],
    queryFn: () => fakeDelay(itemsStore.find((item) => item.id === id)),
    enabled: !!id,
  })
}

function toPointsItem(values: PointsItemFormValues): Omit<PointsItem, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'> {
  if (values.type === PointsItemType.External) {
    return {
      code: values.externalCode || `EXT-${Date.now().toString().slice(-6)}`,
      name: values.name,
      description: values.description,
      type: PointsItemType.External,
      categoryLabel: externalCategoryLabel(values.externalCategory),
      imageUrl: values.imageUrl,
      points: values.points,
      externalCategory: values.externalCategory || undefined,
      vigency: values.vigency,
      startDate: values.startDate || undefined,
      endDate: values.vigency === 'with_end_date' ? values.endDate || undefined : undefined,
      status: values.status,
    }
  }

  const { name, categoryLabel } = resolveCatalogNaming(values)

  return {
    code: `VEN-${Date.now().toString().slice(-6)}`,
    name,
    description: values.description,
    type: PointsItemType.Product,
    categoryLabel,
    points: values.points,
    unitType: values.unitType,
    productLevel: values.productLevel,
    productLevelValue: values.productLevelValue,
    productId: values.productId || undefined,
    vigency: values.vigency,
    startDate: values.startDate || undefined,
    endDate: values.vigency === 'with_end_date' ? values.endDate || undefined : undefined,
    status: values.status,
  }
}

/** El tab "Producto del catálogo" no pide un nombre manual: se deriva del producto puntual elegido en
 * "Buscar producto" o, si no hay uno, del valor de nivel seleccionado (Canal/Marca/Categoría/Grupo/Familia). */
function resolveCatalogNaming(values: PointsItemFormValues): { name: string; categoryLabel: string } {
  if (values.productId) {
    const product = getProductOptions('producto').find((option) => option.value === values.productId)
    return {
      name: product?.label ?? 'Producto del catálogo',
      categoryLabel: getProductBreadcrumb(values.productId) || 'Producto del catálogo',
    }
  }

  if (values.productLevel && values.productLevelValue) {
    const value = getProductOptions(values.productLevel).find((option) => option.value === values.productLevelValue)
    const levelLabel = productLevelOptions.find((option) => option.value === values.productLevel)?.label
    return {
      name: value?.label ?? 'Producto del catálogo',
      categoryLabel: levelLabel ?? 'Producto del catálogo',
    }
  }

  return { name: 'Producto del catálogo', categoryLabel: 'Producto del catálogo' }
}

function externalCategoryLabel(category: ExternalItemCategory | ''): string {
  switch (category) {
    case ExternalItemCategory.Electrodomesticos:
      return 'Electrodomésticos'
    case ExternalItemCategory.Tecnologia:
      return 'Tecnología'
    case ExternalItemCategory.Vales:
      return 'Vales'
    default:
      return 'Ítem externo'
  }
}

export function useSavePointsItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: { id?: string; values: PointsItemFormValues }) =>
      fakeDelay(null).then(() => {
        const now = new Date().toISOString()

        if (id) {
          itemsStore = itemsStore.map((item) => (item.id === id ? { ...item, ...toPointsItem(values), updatedAt: now } : item))
          return itemsStore.find((item) => item.id === id)!
        }

        const newItem: PointsItem = {
          id: crypto.randomUUID(),
          createdBy: 'Admin System',
          createdAt: now,
          updatedAt: now,
          ...toPointsItem(values),
        }
        itemsStore = [newItem, ...itemsStore]
        return newItem
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pointsItemsKey })
    },
  })
}

export function useTogglePointsItemStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      fakeDelay(null).then(() => {
        itemsStore = itemsStore.map((item) =>
          item.id === id
            ? {
                ...item,
                status: item.status === PointsItemStatus.Active ? PointsItemStatus.Inactive : PointsItemStatus.Active,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
        return itemsStore.find((item) => item.id === id)!
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pointsItemsKey })
    },
  })
}
