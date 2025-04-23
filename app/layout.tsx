import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/sidebar-provider"
import { DiveCenterProvider } from "@/lib/dive-center-context"
import { inter } from "@/app/fonts"

export const metadata = {
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <SidebarProvider>
            <DiveCenterProvider>
              {children}
              <Toaster />
            </DiveCenterProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
