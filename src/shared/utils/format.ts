export function formatBs(value: number): string {
  return `Bs ${new Intl.NumberFormat('es-BO').format(value)}`
}

export function formatPercent(value: number, { withSign = false } = {}): string {
  const sign = withSign && value > 0 ? '+' : ''
  return `${sign}${value}%`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(iso)
  )
}
