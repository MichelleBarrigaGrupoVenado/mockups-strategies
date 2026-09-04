import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

function PaginationBar({
  page,
  totalPages,
  total,
  rangeStart,
  rangeEnd,
  onPageChange,
  itemLabel = "resultados",
  className,
}: {
  page: number
  totalPages: number
  total: number
  rangeStart: number
  rangeEnd: number
  onPageChange: (page: number) => void
  itemLabel?: string
  className?: string
}) {
  return (
    <div className={className ?? "flex items-center justify-between border-t border-border px-4 py-3"}>
      <span className="text-sm text-muted-foreground">
        {total === 0 ? "Sin resultados" : `Mostrando ${rangeStart} a ${rangeEnd} de ${total} ${itemLabel}`}
      </span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
          <ChevronLeft size={15} />
        </Button>
        <span className="px-2 text-sm text-foreground">{page}</span>
        <Button variant="outline" size="icon-sm" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
          <ChevronRight size={15} />
        </Button>
      </div>
    </div>
  )
}

export { PaginationBar }
