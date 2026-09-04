export type ProductLevel = 'canal' | 'marca' | 'categoria' | 'grupo' | 'familia' | 'producto'

export interface ProductRefItem {
  id: string
  parentId: string | null
  name: string
  imageUrl?: string
}

/** product_channels_ref */
const channels: ProductRefItem[] = [
  { id: 'ch-1', parentId: null, name: 'ALIMENTOS' },
  { id: 'ch-2', parentId: null, name: 'BEBIDAS Y LACTEOS' },
  { id: 'ch-3', parentId: null, name: 'CUIDADO PERSONAL Y DEL HOGAR' },
  { id: 'ch-4', parentId: null, name: 'PANIFICACION' },
  { id: 'ch-5', parentId: null, name: 'SALSAS' },
]

/** product_brands_ref (channel_id) */
const brands: ProductRefItem[] = [
  { id: 'br-1', parentId: 'ch-1', name: 'MARCAS ALIMENTOS' },
  { id: 'br-2', parentId: 'ch-2', name: 'MARCAS BEBIDAS Y LACTEOS' },
  { id: 'br-3', parentId: 'ch-3', name: 'MARCAS CUIDADO PERSONAL Y DEL HOGAR' },
  { id: 'br-4', parentId: 'ch-4', name: 'MARCAS PANIFICACION' },
  { id: 'br-5', parentId: 'ch-5', name: 'MARCAS SALSAS' },
]

/** product_categories_ref (brand_id) */
const categories: ProductRefItem[] = [
  { id: 'ca-1', parentId: 'br-1', name: 'CATEGORIA ALIMENTOS' },
  { id: 'ca-2', parentId: 'br-2', name: 'CATEGORIA BEBIDAS Y LACTEOS' },
  { id: 'ca-3', parentId: 'br-3', name: 'CATEGORIA CUIDADO PERSONAL Y DEL HOGAR' },
  { id: 'ca-4', parentId: 'br-4', name: 'CATEGORIA PANIFICACION' },
  { id: 'ca-5', parentId: 'br-5', name: 'CATEGORIA SALSAS' },
]

/** product_groups_ref (category_id) */
const groups: ProductRefItem[] = [
  { id: 'gr-1', parentId: 'ca-1', name: 'GRUPO ALIMENTOS' },
  { id: 'gr-2', parentId: 'ca-2', name: 'GRUPO BEBIDAS Y LACTEOS' },
  { id: 'gr-3', parentId: 'ca-3', name: 'GRUPO CUIDADO PERSONAL Y DEL HOGAR' },
  { id: 'gr-4', parentId: 'ca-4', name: 'GRUPO PANIFICACION' },
  { id: 'gr-5', parentId: 'ca-5', name: 'GRUPO SALSAS' },
]

/** product_families_ref (group_id) */
const families: ProductRefItem[] = [
  { id: 'fa-1', parentId: 'gr-1', name: 'CALDOS Y SOPAS' },
  { id: 'fa-2', parentId: 'gr-1', name: 'CEREALES Y DESAYUNO' },
  { id: 'fa-3', parentId: 'gr-1', name: 'CHOCOLATE EN POLVO' },
  { id: 'fa-4', parentId: 'gr-1', name: 'GELATINAS Y POSTRES' },
  { id: 'fa-5', parentId: 'gr-1', name: 'REFRESCOS EN POLVO' },
  { id: 'fa-6', parentId: 'gr-1', name: 'PURE Y GUARNICIONES' },
  { id: 'fa-7', parentId: 'gr-1', name: 'ATUN Y CONSERVAS' },
  { id: 'fa-8', parentId: 'gr-1', name: 'ACEITES' },
  { id: 'fa-9', parentId: 'gr-1', name: 'ALMIDONES' },
  { id: 'fa-10', parentId: 'gr-2', name: 'BEBIDAS ISOTONICAS' },
  { id: 'fa-11', parentId: 'gr-2', name: 'NECTARES DE LA GRANJA' },
  { id: 'fa-12', parentId: 'gr-2', name: 'BEBIDAS REFRESCANTES' },
  { id: 'fa-13', parentId: 'gr-3', name: 'AMBIENTADORES' },
  { id: 'fa-14', parentId: 'gr-3', name: 'DETERGENTES' },
  { id: 'fa-15', parentId: 'gr-3', name: 'LAVAVAJILLAS' },
  { id: 'fa-16', parentId: 'gr-3', name: 'JABONES Y ALCOHOL EN GEL' },
  { id: 'fa-17', parentId: 'gr-3', name: 'LIMPIADORES DE PISO Y SUPERFICIES' },
  { id: 'fa-18', parentId: 'gr-3', name: 'LAVANDINA Y DESINFECTANTES' },
  { id: 'fa-19', parentId: 'gr-3', name: 'INSECTICIDAS' },
  { id: 'fa-20', parentId: 'gr-3', name: 'GUANTES Y ACCESORIOS' },
  { id: 'fa-21', parentId: 'gr-3', name: 'PACKS PROMOCIONALES HOGAR' },
  { id: 'fa-22', parentId: 'gr-4', name: 'LEVADURAS' },
  { id: 'fa-23', parentId: 'gr-4', name: 'MEJORADORES Y POLVO DE HORNEAR' },
  { id: 'fa-24', parentId: 'gr-5', name: 'KETCHUP' },
  { id: 'fa-25', parentId: 'gr-5', name: 'MAYONESA' },
  { id: 'fa-26', parentId: 'gr-5', name: 'MOSTAZA' },
  { id: 'fa-27', parentId: 'gr-5', name: 'SALSA GOLF' },
  { id: 'fa-28', parentId: 'gr-5', name: 'SALSAS CRIOLLAS Y PICANTES' },
  { id: 'fa-29', parentId: 'gr-5', name: 'SALSA BARBACOA' },
  { id: 'fa-30', parentId: 'gr-5', name: 'EXTRACTO Y SALSA DE TOMATE' },
]

/** product_ref (family_id) — nivel final, ejemplo de SKUs por familia */
const products: ProductRefItem[] = [
  { id: 'pr-1', parentId: 'fa-1', name: 'Sopa de Pollo con Fideo 70g' },
  { id: 'pr-2', parentId: 'fa-1', name: 'Caldo de Gallina 12 cubos', imageUrl: 'https://amarket.com.bo/cdn/shop/files/7771214007910_1200x1200.jpg?v=1769188078' },
  { id: 'pr-3', parentId: 'fa-2', name: 'Cereal de Maíz Azucarado 400g' },
  { id: 'pr-4', parentId: 'fa-2', name: 'Avena Instantánea 300g' },
  { id: 'pr-5', parentId: 'fa-3', name: 'Chocolate en Polvo Clásico 400g' },
  { id: 'pr-6', parentId: 'fa-4', name: 'Gelatina Sabor Fresa 80g' },
  { id: 'pr-7', parentId: 'fa-5', name: 'Refresco en Polvo Naranja 15g' },
  { id: 'pr-8', parentId: 'fa-7', name: 'Atún en Aceite Lata 170g' },
  { id: 'pr-9', parentId: 'fa-8', name: 'Aceite Vegetal 1L' },
  { id: 'pr-10', parentId: 'fa-10', name: 'Bebida Isotónica Limón 500ml' },
  { id: 'pr-11', parentId: 'fa-11', name: 'Néctar de Durazno 1L' },
  { id: 'pr-12', parentId: 'fa-12', name: 'Bebida Refrescante Cola 2L' },
  { id: 'pr-13', parentId: 'fa-14', name: 'Detergente en Polvo 1kg' },
  { id: 'pr-14', parentId: 'fa-15', name: 'Lavavajillas Limón 750ml' },
  { id: 'pr-15', parentId: 'fa-16', name: 'Jabón de Tocador 125g' },
  { id: 'pr-16', parentId: 'fa-16', name: 'Alcohol en Gel 250ml' },
  { id: 'pr-17', parentId: 'fa-22', name: 'Levadura Instantánea 10g' },
  { id: 'pr-18', parentId: 'fa-24', name: 'Ketchup Clásico 400g' },
  { id: 'pr-19', parentId: 'fa-25', name: 'Mayonesa Original 400g' },
  { id: 'pr-20', parentId: 'fa-26', name: 'Mostaza Clásica 200g' },
  { id: 'pr-21', parentId: 'fa-30', name: 'Salsa de Tomate 400g' },
]

export const productLevelOptions: { value: ProductLevel; label: string }[] = [
  { value: 'canal', label: 'Sector' },
  { value: 'marca', label: 'Marca' },
  { value: 'categoria', label: 'Categoría' },
  { value: 'grupo', label: 'Grupo' },
  { value: 'familia', label: 'Familia' },
  { value: 'producto', label: 'Producto' },
]

const dataByLevel: Record<ProductLevel, ProductRefItem[]> = {
  canal: channels,
  marca: brands,
  categoria: categories,
  grupo: groups,
  familia: families,
  producto: products,
}

export function getProductOptions(level: ProductLevel | ''): { value: string; label: string }[] {
  if (!level) return []
  return dataByLevel[level].map((item) => ({ value: item.id, label: item.name }))
}

/** Breadcrumb "Grupo / Familia" de un producto del nivel final, para mostrarlo como referencia al seleccionarlo. */
export function getProductBreadcrumb(productId: string): string {
  const product = products.find((item) => item.id === productId)
  if (!product) return ''
  const family = families.find((item) => item.id === product.parentId)
  const group = family ? groups.find((item) => item.id === family.parentId) : undefined
  return [group?.name, family?.name].filter(Boolean).join(' / ')
}
