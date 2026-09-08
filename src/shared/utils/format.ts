export function formatBs(value: number): string {
  return `Bs ${new Intl.NumberFormat('es-BO').format(value)}`
}

export function formatPercent(value: number, { withSign = false } = {}): string {
  const sign = withSign && value > 0 ? '+' : ''
  return `${sign}${value}%`
}

export function formatDate(iso: string): string {
  // Un `yyyy-mm-dd` se parsea como medianoche UTC y en Bolivia (UTC-4) se mostraría el día anterior:
  // se lo fuerza a medianoche local. Los timestamps completos ya traen su zona y se dejan como vienen.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00`) : new Date(iso)
  return new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
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

/** Primer día del mes siguiente al actual, en formato `yyyy-mm-dd`. */
export function firstOfNextMonthIso(): string {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth.toISOString().split('T')[0]
}

/** Meses de recompra consecutiva, ej. `3` -> `"3m"`. */
export function formatFrequency(meses: number): string {
  return `${meses}m`
}

/** Monto en Bs con dos decimales al estilo es-BO, ej. `6840` -> `"Bs 6.840,00"`. */
export function formatBsAmount(value: number): string {
  return `Bs ${new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`
}

/** Puntos con separador de miles y sufijo, ej. `125000` -> `"125.000 pts"`. */
export function formatPoints(value: number): string {
  return `${new Intl.NumberFormat('es-BO').format(value)} pts`
}

/** Puntos abreviados para leyendas, ej. `125000` -> `"125k pts"`. */
export function formatPointsShort(value: number): string {
  if (Math.abs(value) < 1000) return `${value} pts`
  const thousands = value / 1000
  const rounded = Math.round(thousands * 10) / 10
  return `${new Intl.NumberFormat('es-BO').format(rounded)}k pts`
}

/** Porcentaje con decimales al estilo es-BO, ej. `66` -> `"66,0%"`. */
export function formatPercentDecimal(value: number, digits = 1): string {
  return `${new Intl.NumberFormat('es-BO', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)}%`
}

/** Cantidad entera con separador de miles al estilo es-BO, ej. `1253` -> `"1.253"`. */
export function formatCount(value: number): string {
  return new Intl.NumberFormat('es-BO').format(value)
}

/** Número decimal al estilo es-BO, ej. `8.4` -> `"8,4"`. */
export function formatDecimal(value: number, digits = 1): string {
  return new Intl.NumberFormat('es-BO', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
}
