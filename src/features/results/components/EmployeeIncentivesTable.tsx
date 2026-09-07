import { useMemo, useState } from 'react'
import { Award, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { EmployeeIncentiveSort, type EmployeeIncentiveRow, type IncentivesResult } from '@/features/results/types'
import { formatBsAmount, formatPercentDecimal, formatPoints } from '@/shared/utils/format'

interface EmployeeIncentiveMetrics extends EmployeeIncentiveRow {
  pointsEarnedBs: number
  pointsRedeemedBs: number
  redemptionPercent: number
  totalIncentiveBs: number
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function EmployeeIncentivesTable({ data }: { data: IncentivesResult }) {
  const [sort, setSort] = useState<EmployeeIncentiveSort>(EmployeeIncentiveSort.TotalValue)

  const rows = useMemo<EmployeeIncentiveMetrics[]>(() => {
    const withMetrics = data.employees.map((employee) => {
      const pointsRedeemedBs = Math.round(employee.pointsRedeemed * data.bsPerPoint * 100) / 100
      return {
        ...employee,
        pointsEarnedBs: Math.round(employee.pointsEarned * data.bsPerPoint * 100) / 100,
        pointsRedeemedBs,
        redemptionPercent:
          employee.pointsEarned === 0 ? 0 : Math.round((employee.pointsRedeemed / employee.pointsEarned) * 1000) / 10,
        totalIncentiveBs: Math.round((pointsRedeemedBs + employee.priceRulesBs) * 100) / 100,
      }
    })

    return withMetrics.sort((a, b) => {
      if (sort === EmployeeIncentiveSort.Points) return b.pointsEarned - a.pointsEarned
      if (sort === EmployeeIncentiveSort.Utilization) return b.redemptionPercent - a.redemptionPercent
      return b.totalIncentiveBs - a.totalIncentiveBs
    })
  }, [data, sort])

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Users size={14} className="text-muted-foreground" />
            Incentivos por Empleado
          </h3>
          <p className="text-sm text-muted-foreground">Auditoría y ranking de generación de incentivos por ejecutivo</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Ordenar por:</span>
          <Tabs value={sort} onValueChange={(value) => setSort(value as EmployeeIncentiveSort)}>
            <TabsList>
              <TabsTrigger value={EmployeeIncentiveSort.TotalValue}>Mayor Valor (Bs)</TabsTrigger>
              <TabsTrigger value={EmployeeIncentiveSort.Points}>Mayor Puntos</TabsTrigger>
              <TabsTrigger value={EmployeeIncentiveSort.Utilization}>% Utilización</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre y rol</TableHead>
            <TableHead>Puntos ganados</TableHead>
            <TableHead>Puntos canjeados</TableHead>
            <TableHead>% redención</TableHead>
            <TableHead>Reglas precio</TableHead>
            <TableHead className="text-right">Valor total incentivo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className={cn(index < 2 && 'bg-primary text-primary-foreground')}>{initials(row.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{row.name}</span>
                    <span className="text-xs text-muted-foreground">{row.role}</span>
                  </div>
                  {index === 0 && (
                    <Badge className="gap-1 bg-success/10 text-success">
                      <Award size={12} />
                      Top Performer
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{formatPoints(row.pointsEarned)}</span>
                  <span className="text-xs text-muted-foreground">{formatBsAmount(row.pointsEarnedBs)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{formatPoints(row.pointsRedeemed)}</span>
                  <span className="text-xs text-info">{formatBsAmount(row.pointsRedeemedBs)}</span>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    row.redemptionPercent >= 70 ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {formatPercentDecimal(row.redemptionPercent)}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatBsAmount(row.priceRulesBs)}</TableCell>
              <TableCell className="text-right font-semibold text-foreground">{formatBsAmount(row.totalIncentiveBs)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
