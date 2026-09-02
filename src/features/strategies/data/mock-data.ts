import { StrategyObjective, StrategyStatus, type StrategyDetail, type StrategySummary, type TargetClient } from '@/features/strategies/types'

/** Centro aproximado de cada ciudad, usado para dispersar clientes mock alrededor. */
export const cityCenters: Record<string, { lat: number; lng: number }> = {
  'santa-cruz': { lat: -17.7833, lng: -63.1821 },
  'la-paz': { lat: -16.5, lng: -68.15 },
  cochabamba: { lat: -17.3895, lng: -66.1568 },
}

export const mockTargetClients: TargetClient[] = [
  { id: 'c1', name: 'María López', ticketPromedio: 1250, ultimaCompra: '2026-08-15', metaMin: 1375, metaMax: 1500, lat: -17.7699, lng: -63.1955, city: 'santa-cruz', channel: 'moderno', subchannel: 'supermercado' },
  { id: 'c2', name: 'Carlos Mendoza', ticketPromedio: 980, ultimaCompra: '2026-08-12', ultimaVisita: '2026-08-12', metaMin: 1020, metaMax: 1100, lat: -17.7912, lng: -63.1687, city: 'santa-cruz', channel: 'tradicional', subchannel: 'abarrote' },
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
  { id: 'c16', name: 'Hugo Terrazas', ticketPromedio: 1050, ultimaCompra: '2026-08-17', ultimaVisita: '2026-08-17', metaMin: 1150, metaMax: 1230, lat: -17.4023, lng: -66.1712, city: 'cochabamba', channel: 'tradicional', subchannel: 'abarrote' },
  { id: 'c17', name: 'Lucía Rocha', ticketPromedio: 1880, ultimaCompra: '2026-08-01', ultimaVisita: '2026-08-01', metaMin: 2050, metaMax: 2180, lat: -17.3654, lng: -66.1834, city: 'cochabamba', channel: 'moderno', subchannel: 'hipermercado' },
  { id: 'c18', name: 'Ricardo Salazar', ticketPromedio: 830, ultimaCompra: '2026-07-30', ultimaVisita: '2026-07-30', metaMin: 900, metaMax: 970, lat: -17.4189, lng: -66.1301, city: 'cochabamba', channel: 'tradicional', subchannel: 'licoreria' },
  { id: 'c19', name: 'Daniela Peredo', ticketPromedio: 1560, ultimaCompra: '2026-07-29', ultimaVisita: '2026-07-29', metaMin: 1710, metaMax: 1820, lat: -17.3567, lng: -66.1589, city: 'cochabamba', channel: 'mayorista', subchannel: 'distribuidor' },
  { id: 'c20', name: 'Óscar Vidal', ticketPromedio: 1120, ultimaCompra: '2026-07-28', ultimaVisita: '2026-07-28', metaMin: 1220, metaMax: 1300, lat: -17.3912, lng: -66.1956, city: 'cochabamba', channel: 'moderno', subchannel: 'tienda-conveniencia' },
]

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
