import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SidebarToggle } from "@/components/sidebar-toggle"
import { useSidebar } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  const { collapsed } = useSidebar()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 md:hidden">
              <MobileNav />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <SidebarToggle />
              <h1 className="text-xl font-bold">Scubafy</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 bg-muted/40 border-none focus-visible:ring-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <UserNav />
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-0 md:grid-cols-[auto_1fr]">
        <aside
          className={cn(
            "hidden md:block transition-all duration-300 ease-in-out",
            collapsed ? "w-[60px]" : "w-[200px]",
          )}
        >
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
          <div className="flex-1 space-y-6 p-6 pt-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

