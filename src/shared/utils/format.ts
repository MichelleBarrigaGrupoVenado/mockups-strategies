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

/** Fecha de hoy en formato `yyyy-mm-dd`, lista para un `<input type="date">`. */
export function todayIso(): string {
  return new Date().toISOString().split('T')[0]
}

/** `dateIso` desplazada `months` meses, preservando el formato `yyyy-mm-dd`. */
export function addMonthsIso(dateIso: string, months: number): string {
  const date = new Date(`${dateIso}T00:00:00`)
  date.setMonth(date.getMonth() + months)
  return date.toISOString().split('T')[0]
}
