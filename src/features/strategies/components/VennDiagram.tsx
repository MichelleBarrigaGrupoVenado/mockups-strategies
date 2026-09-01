export function VennDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
      <circle cx="80" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="120" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="55" y="64" fontSize="12" fill="currentColor" fontWeight="600">
        A
      </text>
      <text x="140" y="64" fontSize="12" fill="currentColor" fontWeight="600">
        B
      </text>
    </svg>
  )
}
