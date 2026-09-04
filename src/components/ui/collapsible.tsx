"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

import { cn } from "@/lib/utils"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  className,
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        "group/collapsible-trigger flex w-full cursor-pointer items-center justify-between gap-2 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden transition-all data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 h-(--collapsible-panel-height)",
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
