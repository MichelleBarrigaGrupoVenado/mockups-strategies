// Catálogos de referencia portados de https://github.com/leotorricovenado/pricerules-mockups
// (src/features/price-rules/data/catalogs.ts) — en el repo original representan datos de otros
// microservicios (Catálogo, Sales); acá se mantienen igual porque esta app tampoco llama a un backend.

export interface CatalogItem {
  id: number
  code: string
  name: string
}

// La unidad de medida es un atributo propio del producto en el catálogo — no es algo que la regla de
// precio pueda elegir o editar. `units` es la cadena de empaque del producto (de la más chica a la
// más grande, ej. Ketchup: Display → Caja) — el resultado "Bonificación de Productos"/"Recargo por
// producto" sí deja elegir en qué unidad de esa cadena se entrega/recarga, a diferencia de `unit` (fijo).
export interface ProductCatalogItem extends CatalogItem {
  unit: string
  units: string[]
  brandId?: number
  categoryId?: number
  familyId?: number
  subFamilyId?: number
  divisionId?: number
  referencePrice: number
}

export const DISTRIBUTORS: CatalogItem[] = [
  { id: 1, code: 'DISCRUZ', name: 'Distribuidora Santa Cruz' },
  { id: 2, code: 'DISPAZ', name: 'Distribuidora La Paz' },
  { id: 3, code: 'COCHABAMBA', name: 'Distribuidora Cochabamba' },
  { id: 4, code: 'DISTAR', name: 'Distribuidora Tarija' },
  { id: 6, code: 'SUCRE', name: 'Distribuidora Sucre' },
  { id: 7, code: 'POTOSI', name: 'Distribuidora Potosí' },
  { id: 8, code: 'ORURO', name: 'Distribuidora Oruro' },
  { id: 9, code: 'BENI', name: 'Distribuidora Beni' },
  { id: 10, code: 'DISALTO', name: 'Distribuidora El Alto' },
  { id: 15, code: 'PANDO', name: 'Distribuidora Pando' },
  { id: 16, code: 'RIBERALTA', name: 'Distribuidora Riberalta' },
]

// Muestra representativa — en producción son ~290 (almacenes físicos + camiones de reparto).
export const WAREHOUSES: CatalogItem[] = [
  { id: 101, code: 'ALM-SC-01', name: 'Almacén Central Santa Cruz' },
  { id: 102, code: 'CAM-SC-04', name: 'Camión Reparto SC-04' },
  { id: 201, code: 'ALM-LP-01', name: 'Almacén Central La Paz' },
  { id: 202, code: 'CAM-LP-02', name: 'Camión Reparto LP-02' },
  { id: 301, code: 'ALM-CB-01', name: 'Almacén Central Cochabamba' },
  { id: 1001, code: 'ALM-ALTO-01', name: 'Almacén El Alto' },
]

export const CUSTOMERS: CatalogItem[] = [
  { id: 200001, code: '200001', name: 'Hipermaxi S.A.' },
  { id: 200002, code: '200002', name: 'Rinconada SRL' },
  { id: 200003, code: '200003', name: 'Tresbede' },
  { id: 134125, code: '134125', name: 'Comercial Rojas SRL' },
  { id: 134126, code: '134126', name: 'Mini Market Los Andes' },
  { id: 112009, code: '112009', name: 'Abarrotes La Esquina' },
]

export const OWNERS: CatalogItem[] = [
  { id: 1, code: 'OWN-01', name: 'Grupo Venado — Directo' },
  { id: 2, code: 'OWN-02', name: 'Franquicia Sur' },
  { id: 3, code: 'OWN-03', name: 'Franquicia Norte' },
]

export const SALE_CHANNELS: CatalogItem[] = [
  { id: 1, code: 'CAN-MOD', name: 'Canal Moderno' },
  { id: 2, code: 'CAN-TRAD', name: 'Canal Tradicional' },
  { id: 3, code: 'CAN-HOR', name: 'Canal Horizontal' },
]

export const SUB_SALE_CHANNELS: CatalogItem[] = [
  { id: 1, code: 'SUBCANAL-CENTRO', name: 'Subcanal Centro' },
  { id: 2, code: 'SUBCANAL-NORTE', name: 'Subcanal Norte' },
  { id: 3, code: 'SUBCANAL-SUR', name: 'Subcanal Sur' },
]

export const ROUTES: CatalogItem[] = [
  { id: 1, code: 'RUTA-01', name: 'Ruta 01 — Centro' },
  { id: 2, code: 'RUTA-02', name: 'Ruta 02 — Zona Norte' },
  { id: 3, code: 'RUTA-03', name: 'Ruta 03 — Zona Sur' },
]

export const SELLERS: CatalogItem[] = [
  { id: 5638, code: '5638', name: 'Juan Pérez' },
  { id: 5701, code: '5701', name: 'María Fernández' },
  { id: 5822, code: '5822', name: 'Roberto Quispe' },
]

export const BRANDS: CatalogItem[] = [
  { id: 4, code: 'MARCA-04', name: 'Kris' },
  { id: 12, code: 'MARCA-12', name: 'Real' },
  { id: 23, code: 'MARCA-23', name: 'Pulpin' },
  { id: 31, code: 'MARCA-31', name: 'Bristar' },
  { id: 45, code: 'MARCA-45', name: 'De La Granja' },
  { id: 52, code: 'MARCA-52', name: 'Speranza' },
  { id: 68, code: 'MARCA-68', name: 'El Pescador' },
  { id: 77, code: 'MARCA-77', name: 'Ingavi' },
]

export const CATEGORIES: CatalogItem[] = [
  { id: 1, code: 'CAT-01', name: 'Salsas y Aderezos' },
  { id: 2, code: 'CAT-02', name: 'Limpieza del Hogar' },
  { id: 3, code: 'CAT-03', name: 'Bebidas' },
  { id: 4, code: 'CAT-04', name: 'Culinarios' },
  { id: 5, code: 'CAT-05', name: 'Panificación' },
]

export const FAMILIES: CatalogItem[] = [
  { id: 1, code: 'FAM-01', name: 'Alimentos' },
  { id: 2, code: 'FAM-02', name: 'Cuidado del Hogar' },
  { id: 3, code: 'FAM-03', name: 'Bebidas' },
]

export const SUB_FAMILIES: CatalogItem[] = [
  { id: 1, code: 'SF-01', name: 'Ketchup' },
  { id: 2, code: 'SF-02', name: 'Mayonesa' },
  { id: 3, code: 'SF-03', name: 'Detergentes' },
  { id: 4, code: 'SF-04', name: 'Lavavajillas' },
]

export const DIVISIONS: CatalogItem[] = [
  { id: 1, code: 'DIV-01', name: 'División Alimentos y Salsas' },
  { id: 2, code: 'DIV-02', name: 'División Limpieza' },
  { id: 3, code: 'DIV-03', name: 'División Bebidas' },
]

export const PRODUCTS: ProductCatalogItem[] = [
  { id: 5001, code: 'P-5001', name: 'Ketchup Real 500ml', unit: 'BOTELLA', units: ['DISPLAY', 'CAJA'], brandId: 12, categoryId: 1, familyId: 1, subFamilyId: 1, divisionId: 1, referencePrice: 9.9 },
  { id: 5002, code: 'P-5002', name: 'Mayonesa Real 500ml', unit: 'POMO', units: ['DISPLAY', 'CAJA'], brandId: 12, categoryId: 1, familyId: 1, subFamilyId: 2, divisionId: 1, referencePrice: 11.5 },
  { id: 5003, code: 'P-5003', name: 'Ketchup Kris 980g', unit: 'BOLSA', units: ['DISPLAY', 'CAJA'], brandId: 4, categoryId: 1, familyId: 1, subFamilyId: 1, divisionId: 1, referencePrice: 14.2 },
  { id: 5004, code: 'P-5004', name: 'Mayonesa Kris 980g', unit: 'BOLSA', units: ['DISPLAY', 'CAJA'], brandId: 4, categoryId: 1, familyId: 1, subFamilyId: 2, divisionId: 1, referencePrice: 12.5 },
  { id: 5005, code: 'P-5005', name: 'Mostaza/Ketchup Kris 485g', unit: 'SOBRE', units: ['DISPLAY', 'CAJA'], brandId: 4, categoryId: 1, familyId: 1, subFamilyId: 1, divisionId: 1, referencePrice: 8.9 },
  { id: 5006, code: 'P-5006', name: 'Detergente en Polvo Pulpin 150gr', unit: 'BOLSA', units: ['PAQUETE', 'CAJA'], brandId: 23, categoryId: 2, familyId: 2, subFamilyId: 3, divisionId: 2, referencePrice: 4.5 },
  { id: 5007, code: 'P-5007', name: 'Lavavajillas Pulpin 600ml', unit: 'BOTELLA', units: ['DISPLAY', 'CAJA'], brandId: 23, categoryId: 2, familyId: 2, subFamilyId: 4, divisionId: 2, referencePrice: 7.8 },
  { id: 5008, code: 'P-5008', name: 'Vajillero Bristar Doypack 1L', unit: 'DISPLAY', units: ['DISPLAY', 'CAJA'], brandId: 31, categoryId: 2, familyId: 2, subFamilyId: 4, divisionId: 2, referencePrice: 13.0 },
  { id: 5009, code: 'P-5009', name: 'Agua Speranza 2L', unit: 'BOTELLA', units: ['PAQUETE', 'CAJA'], brandId: 52, categoryId: 3, familyId: 3, divisionId: 3, referencePrice: 6.5 },
  { id: 5010, code: 'P-5010', name: 'De La Granja Naranja 2L', unit: 'BOTELLA', units: ['PAQUETE', 'CAJA'], brandId: 45, categoryId: 3, familyId: 3, divisionId: 3, referencePrice: 9.0 },
  { id: 5011, code: 'P-5011', name: 'Atún El Pescador', unit: 'LATA', units: ['DISPLAY', 'CAJA'], brandId: 68, categoryId: 4, familyId: 1, divisionId: 1, referencePrice: 10.5 },
  { id: 5012, code: 'P-5012', name: 'Levadura Fresca Ingavi 500gr', unit: 'PAQUETE', units: ['PAQUETE', 'CAJA'], brandId: 77, categoryId: 5, familyId: 1, divisionId: 1, referencePrice: 15.0 },
  { id: 5013, code: 'P-5013', name: 'Aceite de Oliva 1000ml', unit: 'BOTELLA', units: ['DISPLAY', 'CAJA'], categoryId: 4, familyId: 1, divisionId: 1, referencePrice: 22.0 },
  { id: 5014, code: 'P-5014', name: 'Agua Speranza 600ml', unit: 'BOTELLA', units: ['PAQUETE', 'CAJA'], brandId: 52, categoryId: 3, familyId: 3, divisionId: 3, referencePrice: 2.8 },
]

export const UNITS: CatalogItem[] = [
  { id: 1, code: 'UN', name: 'Unidad' },
  { id: 2, code: 'CJ', name: 'Caja' },
  { id: 3, code: 'PAQ', name: 'Paquete' },
]

export function findById(list: CatalogItem[], id: number): CatalogItem | undefined {
  return list.find((i) => i.id === id)
}
