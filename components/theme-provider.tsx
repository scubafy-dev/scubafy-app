"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type AccentColor = "blue" | "green" | "purple" | "amber" | "default"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultAccentColor?: AccentColor
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  accentColor: AccentColor
  setAccentColor: (color: AccentColor) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  accentColor: "default",
  setAccentColor: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultAccentColor = "default",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [accentColor, setAccentColor] = useState<AccentColor>(defaultAccentColor)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove previous theme class
    root.classList.remove("light", "dark")

    // Add current theme class
    root.classList.add(theme)

    // Remove previous accent color classes
    root.classList.remove("accent-default", "accent-blue", "accent-green", "accent-purple", "accent-amber")

    // Add current accent color class
    root.classList.add(`accent-${accentColor}`)
  }, [theme, accentColor])

  const value = {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

