import { Bell, Calendar, Globe, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-1 border-b border-border bg-background px-6">
      <Button variant="ghost" size="icon">
        <Bell size={18} strokeWidth={2} />
      </Button>
      <Button variant="ghost" size="icon">
        <Calendar size={18} strokeWidth={2} />
      </Button>
      <Button variant="ghost" size="icon">
        <Globe size={18} strokeWidth={2} />
      </Button>
      <Button variant="ghost" size="icon">
        <Users size={18} strokeWidth={2} />
      </Button>
      <Avatar className="ml-2 size-8">
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>
    </header>
  )
}
