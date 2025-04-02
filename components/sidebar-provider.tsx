"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type SidebarState = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void
  toggleSidebar: () => void
}

const initialState: SidebarState = {
  collapsed: true,
  setCollapsed: () => null,
  toggleSidebar: () => null,
}

const SidebarContext = createContext<SidebarState>(initialState)

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(true)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState !== null) {
      setCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
  }, [collapsed])

  const toggleSidebar = () => setCollapsed(!collapsed)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>{children}</SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)

  if (context === undefined) throw new Error("useSidebar must be used within a SidebarProvider")

  return context
}

