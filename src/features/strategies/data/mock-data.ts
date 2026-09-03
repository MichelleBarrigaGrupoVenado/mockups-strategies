import { StrategyObjective, StrategyStatus, type StrategyDetail, type StrategySummary, type TargetClient } from '@/features/strategies/types'

/** Centro aproximado de cada ciudad, usado para dispersar clientes mock alrededor. */
export const cityCenters: Record<string, { lat: number; lng: number }> = {
  'santa-cruz': { lat: -17.7833, lng: -63.1821 },
  'la-paz': { lat: -16.5, lng: -68.15 },
  cochabamba: { lat: -17.3895, lng: -66.1568 },
}

type RawTargetClient = Omit<
  TargetClient,
  'mesesUltimaCompra' | 'activo' | 'comproMesActual' | 'visitadoMesActual' | 'deuda' | 'mora' | 'ticketPromedioSegmento' | 'frecuenciaCompra'
>

const rawTargetClients: RawTargetClient[] = [
  { id: 'c1', name: 'María López', ticketPromedio: 1250, ultimaCompra: '2026-08-15', metaMin: 1375, metaMax: 1500, lat: -17.7699, lng: -63.1955, city: 'santa-cruz', channel: 'moderno', subchannel: 'supermercado' },
  { id: 'c2', name: 'Carlos Mendoza', ticketPromedio: 980, ultimaCompra: '2026-08-12', ultimaVisita: '2026-08-12', metaMin: 1020, metaMax: 1100, lat: -17.7912, lng: -63.1687, city: 'santa-cruz', channel: 'tradicional', subchannel: 'restaurante' },
  { id: 'c3', name: 'Ana Gutiérrez', ticketPromedio: 2100, ultimaCompra: '2026-08-10', ultimaVisita: '2026-08-10', metaMin: 2310, metaMax: 2400, lat: -17.7591, lng: -63.1743, city: 'santa-cruz', channel: 'moderno', subchannel: 'hipermercado' },
  { id: 'c4', name: 'José Ramírez', ticketPromedio: 750, ultimaCompra: '2026-08-08', ultimaVisita: '2026-08-08', metaMin: 830, metaMax: 900, lat: -17.8046, lng: -63.1956, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c5', name: 'Laura Fernández', ticketPromedio: 1500, ultimaCompra: '2026-08-05', ultimaVisita: '2026-08-05', metaMin: 1650, metaMax: 1700, lat: -17.7734, lng: -63.2043, city: 'santa-cruz', channel: 'moderno', subchannel: 'tienda-conveniencia' },
  { id: 'c6', name: 'Pedro Ortiz', ticketPromedio: 1180, ultimaCompra: '2026-08-14', ultimaVisita: '2026-08-14', metaMin: 1300, metaMax: 1400, lat: -17.7488, lng: -63.1902, city: 'santa-cruz', channel: 'mayorista', subchannel: 'distribuidor' },
  { id: 'c7', name: 'Sofía Vargas', ticketPromedio: 890, ultimaCompra: '2026-08-11', ultimaVisita: '2026-08-11', metaMin: 950, metaMax: 1020, lat: -17.8138, lng: -63.1611, city: 'santa-cruz', channel: 'tradicional', subchannel: 'kiosko' },
  { id: 'c8', name: 'Diego Rojas', ticketPromedio: 1620, ultimaCompra: '2026-08-09', ultimaVisita: '2026-08-09', metaMin: 1780, metaMax: 1900, lat: -17.7854, lng: -63.2145, city: 'santa-cruz', channel: 'moderno', subchannel: 'supermercado' },
  { id: 'c9', name: 'Valeria Suárez', ticketPromedio: 1340, ultimaCompra: '2026-08-13', ultimaVisita: '2026-08-13', metaMin: 1470, metaMax: 1560, lat: -16.4892, lng: -68.1354, city: 'la-paz', channel: 'moderno', subchannel: 'supermercado' },
  { id: 'c10', name: 'Miguel Choque', ticketPromedio: 820, ultimaCompra: '2026-08-07', ultimaVisita: '2026-08-07', metaMin: 900, metaMax: 970, lat: -16.5127, lng: -68.1622, city: 'la-paz', channel: 'tradicional', subchannel: 'abarrote' },
  { id: 'c11', name: 'Rosa Quispe', ticketPromedio: 1750, ultimaCompra: '2026-08-06', ultimaVisita: '2026-08-06', metaMin: 1920, metaMax: 2050, lat: -16.4956, lng: -68.1198, city: 'la-paz', channel: 'moderno', subchannel: 'hipermercado' },
  { id: 'c12', name: 'Andrés Mamani', ticketPromedio: 960, ultimaCompra: '2026-08-04', ultimaVisita: '2026-08-04', metaMin: 1030, metaMax: 1110, lat: -16.5289, lng: -68.1489, city: 'la-paz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c13', name: 'Camila Flores', ticketPromedio: 1410, ultimaCompra: '2026-08-16', ultimaVisita: '2026-08-16', metaMin: 1540, metaMax: 1640, lat: -16.4738, lng: -68.1567, city: 'la-paz', channel: 'mayorista', subchannel: 'cash-and-carry' },
  { id: 'c14', name: 'Fernando Apaza', ticketPromedio: 700, ultimaCompra: '2026-08-03', ultimaVisita: '2026-08-03', metaMin: 770, metaMax: 830, lat: -16.5051, lng: -68.1789, city: 'la-paz', channel: 'tradicional', subchannel: 'kiosko' },
  { id: 'c15', name: 'Gabriela Colque', ticketPromedio: 1290, ultimaCompra: '2026-08-02', ultimaVisita: '2026-08-02', metaMin: 1410, metaMax: 1500, lat: -17.3721, lng: -66.1423, city: 'cochabamba', channel: 'moderno', subchannel: 'supermercado' },
  { id: 'c16', name: 'Hugo Terrazas', ticketPromedio: 1050, ultimaCompra: '2026-08-17', ultimaVisita: '2026-08-17', metaMin: 1150, metaMax: 1230, lat: -17.4023, lng: -66.1712, city: 'cochabamba', channel: 'tradicional', subchannel: 'restaurante' },
  { id: 'c17', name: 'Lucía Rocha', ticketPromedio: 1880, ultimaCompra: '2026-08-01', ultimaVisita: '2026-08-01', metaMin: 2050, metaMax: 2180, lat: -17.3654, lng: -66.1834, city: 'cochabamba', channel: 'moderno', subchannel: 'hipermercado' },
  { id: 'c18', name: 'Ricardo Salazar', ticketPromedio: 830, ultimaCompra: '2026-07-30', ultimaVisita: '2026-07-30', metaMin: 900, metaMax: 970, lat: -17.4189, lng: -66.1301, city: 'cochabamba', channel: 'tradicional', subchannel: 'licoreria' },
  { id: 'c19', name: 'Daniela Peredo', ticketPromedio: 1560, ultimaCompra: '2026-07-29', ultimaVisita: '2026-07-29', metaMin: 1710, metaMax: 1820, lat: -17.3567, lng: -66.1589, city: 'cochabamba', channel: 'mayorista', subchannel: 'distribuidor' },
  { id: 'c20', name: 'Óscar Vidal', ticketPromedio: 1120, ultimaCompra: '2026-07-28', ultimaVisita: '2026-07-28', metaMin: 1220, metaMax: 1300, lat: -17.3912, lng: -66.1956, city: 'cochabamba', channel: 'moderno', subchannel: 'tienda-conveniencia' },
  // Nuevos clientes - Canal tradicional - Subcanal mercado
  { id: 'c21', name: 'Patricia Molina', ticketPromedio: 680, ultimaCompra: '2026-08-18', ultimaVisita: '2026-08-18', metaMin: 750, metaMax: 820, lat: -17.7821, lng: -63.1814, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c22', name: 'Jorge Salvatierra', ticketPromedio: 920, ultimaCompra: '2026-08-16', ultimaVisita: '2026-08-16', metaMin: 1010, metaMax: 1100, lat: -17.7985, lng: -63.2078, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c23', name: 'Elena Vargas', ticketPromedio: 1150, ultimaCompra: '2026-08-14', ultimaVisita: '2026-08-14', metaMin: 1260, metaMax: 1350, lat: -17.7584, lng: -63.1865, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c24', name: 'Marco Antonio Pérez', ticketPromedio: 760, ultimaCompra: '2026-08-13', ultimaVisita: '2026-08-13', metaMin: 830, metaMax: 900, lat: -17.8124, lng: -63.1792, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c25', name: 'Carmen Rojas', ticketPromedio: 540, ultimaCompra: '2026-08-12', ultimaVisita: '2026-08-12', metaMin: 600, metaMax: 680, lat: -16.5018, lng: -68.1472, city: 'la-paz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c26', name: 'Luis Condori', ticketPromedio: 870, ultimaCompra: '2026-08-10', ultimaVisita: '2026-08-10', metaMin: 960, metaMax: 1050, lat: -16.5186, lng: -68.1308, city: 'la-paz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c27', name: 'Mónica Callisaya', ticketPromedio: 1280, ultimaCompra: '2026-08-09', ultimaVisita: '2026-08-09', metaMin: 1400, metaMax: 1500, lat: -16.4845, lng: -68.1651, city: 'la-paz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c28', name: 'Edwin Huanca', ticketPromedio: 620, ultimaCompra: '2026-08-07', ultimaVisita: '2026-08-07', metaMin: 680, metaMax: 750, lat: -17.3832, lng: -66.1657, city: 'cochabamba', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c29', name: 'Silvia Torrico', ticketPromedio: 990, ultimaCompra: '2026-08-06', ultimaVisita: '2026-08-06', metaMin: 1080, metaMax: 1170, lat: -17.4098, lng: -66.1513, city: 'cochabamba', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c30', name: 'Raúl Fernández', ticketPromedio: 1080, ultimaCompra: '2026-08-04', ultimaVisita: '2026-08-04', metaMin: 1180, metaMax: 1280, lat: -17.3598, lng: -66.1754, city: 'cochabamba', channel: 'tradicional', subchannel: 'mercado-municipal' },
  // Santa Cruz — lote adicional con fechas de última compra escalonadas (0 a 30 meses) para poder
  // probar de verdad los filtros de "Última Compra" (3/6/12 meses) y "Cliente Activo" del wizard.
  { id: 'c31', name: 'Ivonne Suárez', ticketPromedio: 1420, ultimaCompra: '2026-09-01', ultimaVisita: '2026-09-01', metaMin: 1560, metaMax: 1670, lat: -17.7602, lng: -63.1789, city: 'santa-cruz', channel: 'moderno', subchannel: 'supermercado' },
  { id: 'c32', name: 'Franz Justiniano', ticketPromedio: 610, ultimaCompra: '2026-09-02', ultimaVisita: '2026-09-02', metaMin: 670, metaMax: 730, lat: -17.7955, lng: -63.1668, city: 'santa-cruz', channel: 'tradicional', subchannel: 'kiosko' },
  { id: 'c33', name: 'Roxana Áñez', ticketPromedio: 2350, ultimaCompra: '2026-08-05', ultimaVisita: '2026-09-02', metaMin: 2580, metaMax: 2750, lat: -17.7458, lng: -63.2011, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c34', name: 'Wilson Paz', ticketPromedio: 890, ultimaCompra: '2026-07-10', ultimaVisita: '2026-07-10', metaMin: 970, metaMax: 1050, lat: -17.8072, lng: -63.1901, city: 'santa-cruz', channel: 'tradicional', subchannel: 'restaurante' },
  { id: 'c35', name: 'Tania Roca', ticketPromedio: 1780, ultimaCompra: '2026-06-03', ultimaVisita: '2026-06-03', metaMin: 1950, metaMax: 2080, lat: -17.7688, lng: -63.2098, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c36', name: 'Boris Melgar', ticketPromedio: 520, ultimaCompra: '2026-05-15', ultimaVisita: '2026-05-15', metaMin: 570, metaMax: 620, lat: -17.8201, lng: -63.1735, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c37', name: 'Gimena Rivero', ticketPromedio: 1990, ultimaCompra: '2026-04-20', ultimaVisita: '2026-04-20', metaMin: 2180, metaMax: 2320, lat: -17.7532, lng: -63.1622, city: 'santa-cruz', channel: 'mayorista', subchannel: 'cash-and-carry' },
  { id: 'c38', name: 'Néstor Landívar', ticketPromedio: 740, ultimaCompra: '2026-03-03', ultimaVisita: '2026-03-03', metaMin: 810, metaMax: 880, lat: -17.7889, lng: -63.2156, city: 'santa-cruz', channel: 'tradicional', subchannel: 'kiosko' },
  { id: 'c39', name: 'Karina Barbery', ticketPromedio: 1560, ultimaCompra: '2026-02-10', ultimaVisita: '2026-02-10', metaMin: 1710, metaMax: 1830, lat: -17.7411, lng: -63.1877, city: 'santa-cruz', channel: 'moderno', subchannel: 'supermercado' },
  { id: 'c40', name: 'Ramiro Chávez', ticketPromedio: 480, ultimaCompra: '2026-01-05', ultimaVisita: '2026-01-05', metaMin: 530, metaMax: 580, lat: -17.8143, lng: -63.1993, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c41', name: 'Yolanda Peña', ticketPromedio: 2150, ultimaCompra: '2025-12-15', ultimaVisita: '2025-12-15', metaMin: 2350, metaMax: 2500, lat: -17.7644, lng: -63.1706, city: 'santa-cruz', channel: 'moderno', subchannel: 'hipermercado' },
  { id: 'c42', name: 'Sergio Antelo', ticketPromedio: 960, ultimaCompra: '2025-11-20', ultimaVisita: '2025-11-20', metaMin: 1050, metaMax: 1130, lat: -17.7967, lng: -63.1848, city: 'santa-cruz', channel: 'tradicional', subchannel: 'restaurante' },
  { id: 'c43', name: 'Verónica Justiniano', ticketPromedio: 670, ultimaCompra: '2025-10-08', ultimaVisita: '2025-10-08', metaMin: 730, metaMax: 790, lat: -17.7509, lng: -63.2077, city: 'santa-cruz', channel: 'tradicional', subchannel: 'panaderia' },
  { id: 'c44', name: 'Álvaro Roda', ticketPromedio: 1340, ultimaCompra: '2025-09-03', ultimaVisita: '2025-09-03', metaMin: 1470, metaMax: 1570, lat: -17.7756, lng: -63.1592, city: 'santa-cruz', channel: 'moderno', subchannel: 'tienda-conveniencia' },
  { id: 'c45', name: 'Claudia Suárez', ticketPromedio: 590, ultimaCompra: '2025-07-01', ultimaVisita: '2026-08-20', metaMin: 650, metaMax: 700, lat: -17.8087, lng: -63.2034, city: 'santa-cruz', channel: 'tradicional', subchannel: 'licoreria' },
  { id: 'c46', name: 'Freddy Vaca', ticketPromedio: 1870, ultimaCompra: '2025-05-10', ultimaVisita: '2025-05-10', metaMin: 2050, metaMax: 2180, lat: -17.7372, lng: -63.1729, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c47', name: 'Beatriz Ortiz', ticketPromedio: 430, ultimaCompra: '2025-03-01', ultimaVisita: '2025-03-01', metaMin: 470, metaMax: 510, lat: -17.8215, lng: -63.1859, city: 'santa-cruz', channel: 'tradicional', subchannel: 'kiosko' },
  { id: 'c48', name: 'Iván Céspedes', ticketPromedio: 1120, ultimaCompra: '2025-01-10', ultimaVisita: '2025-01-10', metaMin: 1230, metaMax: 1310, lat: -17.7628, lng: -63.2119, city: 'santa-cruz', channel: 'moderno', subchannel: 'supermercado' },
  { id: 'c49', name: 'Nadia Parada', ticketPromedio: 760, ultimaCompra: '2024-09-03', ultimaVisita: '2024-09-03', metaMin: 830, metaMax: 900, lat: -17.7481, lng: -63.1958, city: 'santa-cruz', channel: 'tradicional', subchannel: 'mercado-municipal' },
  { id: 'c50', name: 'Óscar Añez', ticketPromedio: 2480, ultimaCompra: '2024-03-03', ultimaVisita: '2024-03-03', metaMin: 2700, metaMax: 2900, lat: -17.7903, lng: -63.1615, city: 'santa-cruz', channel: 'mayorista', subchannel: 'mayorista-general' },
]

/** "Hoy" de referencia del mock, fijo para que el segmento no cambie según la fecha real del navegador. */
const TARGETING_REFERENCE_DATE = new Date('2026-09-03T00:00:00')

function monthsSince(dateStr: string | undefined, reference: Date): number {
  if (!dateStr) return Infinity
  const date = new Date(dateStr)
  return (reference.getFullYear() - date.getFullYear()) * 12 + (reference.getMonth() - date.getMonth())
}

export const mockTargetClients: TargetClient[] = rawTargetClients.map((client, index) => {
  const mesesUltimaCompra = monthsSince(client.ultimaCompra, TARGETING_REFERENCE_DATE)
  const deuda = index % 5 === 0
  const mora = deuda && index % 2 === 0
  // Proporción del ticket general que corresponde al segmento de producto de la estrategia; varía en
  // ciclos de 5 (0.15 a 0.47) para que la columna "Ticket prom. segmento" no sea un simple % fijo.
  const segmentRatio = 0.15 + (index % 5) * 0.08

  return {
    ...client,
    mesesUltimaCompra,
    activo: mesesUltimaCompra <= 6,
    comproMesActual: mesesUltimaCompra === 0,
    visitadoMesActual: monthsSince(client.ultimaVisita, TARGETING_REFERENCE_DATE) === 0,
    deuda,
    mora,
    ticketPromedioSegmento: Math.round(client.ticketPromedio * segmentRatio),
    frecuenciaCompra: 1 + (index % 6),
  }
})

export const mockStrategySummaries: StrategySummary[] = [
  {
    id: 'recuperacion-clientes-inactivos',
    name: 'Recuperación de clientes inactivos',
    status: StrategyStatus.Active,
    objectiveLabel: 'Incrementar recompra',
    segmentLabel: 'Clientes > 60 días sin compra',
    projectedImpactPercent: 15.8,
    roiEstimate: 4.2,
  },
  {
    id: 'incremento-portafolio',
    name: 'Incremento de portafolio',
    status: StrategyStatus.Active,
    objectiveLabel: 'Aumentar productos por cliente',
    segmentLabel: 'Clientes < 5 categorías',
    projectedImpactPercent: 11.2,
    progressPercent: 75,
  },
  {
    id: 'incremento-ticket',
    name: 'Incremento de ticket',
    status: StrategyStatus.Evaluating,
    objectiveLabel: 'Incrementar Bs/Kg',
    segmentLabel: 'Definiendo segmento...',
    projectedImpactPercent: 0,
  },
]

export const mockStrategyDetails: Record<string, StrategyDetail> = {
  'recuperacion-clientes-inactivos': {
    id: 'recuperacion-clientes-inactivos',
    name: 'Recuperación de clientes inactivos',
    status: StrategyStatus.Active,
    dateRangeLabel: '01 Ago - 31 Ago 2026',
    objectiveDescription:
      'Incrementar la recompra en clientes que no han realizado transacciones en los últimos 90 días mediante incentivos personalizados en Venado Money.',
    metrics: {
      clientesObjetivo: 1248,
      contactados: 892,
      reactivados: 326,
      tasaRecompra: 26.1,
      ventasAtribuibles: 184500,
      ganancia: 72300,
      roi: 4.2,
      venadoMoneyGenerado: 14460,
    },
    impactChart: [
      { label: 'Antes (Promedio 3m)', value: 100 },
      { label: 'Después (Mes actual)', value: 118 },
    ],
    impactDeltaPercent: 18,
    impactNote:
      'Los clientes reactivados muestran un incremento del 18% en su ticket promedio en comparación con su histórico antes de la inactividad.',
  },
}

export const objectiveLabels: Record<StrategyObjective, string> = {
  [StrategyObjective.IncreaseTicket]: 'Incrementar ticket',
  [StrategyObjective.IncreasePortfolio]: 'Incrementar portafolio',
  [StrategyObjective.RecoverCustomers]: 'Recuperar clientes',
  [StrategyObjective.NewCustomers]: 'Crear nuevos clientes',
  [StrategyObjective.Other]: 'Otro',
}
