"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

export function SidebarToggle() {
  const { collapsed, toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="h-9 w-9 transition-all duration-300"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
    </Button>
  )
}

