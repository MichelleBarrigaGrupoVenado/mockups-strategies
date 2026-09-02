export const cityOptions = [
  { value: 'santa-cruz', label: 'Santa Cruz' },
  { value: 'la-paz', label: 'La Paz' },
  { value: 'cochabamba', label: 'Cochabamba' },
]

export const channelOptions = [
  { value: 'moderno', label: 'Moderno' },
  { value: 'tradicional', label: 'Tradicional' },
  { value: 'mayorista', label: 'Mayorista' },
]

export const subChannelOptionsByChannel: Record<string, { value: string; label: string }[]> = {
  moderno: [
    { value: 'supermercado', label: 'Supermercado' },
    { value: 'hipermercado', label: 'Hipermercado' },
    { value: 'tienda-conveniencia', label: 'Tienda de conveniencia' },
  ],
  tradicional: [
    { value: 'abarrote', label: 'Abarrote / Pulpería' },
    { value: 'mercado-municipal', label: 'Mercado municipal' },
    { value: 'kiosko', label: 'Kiosko' },
    { value: 'licoreria', label: 'Licorería' },
  ],
  mayorista: [
    { value: 'distribuidor', label: 'Distribuidor' },
    { value: 'mayorista-general', label: 'Mayorista general' },
    { value: 'cash-and-carry', label: 'Cash & Carry' },
  ],
}
