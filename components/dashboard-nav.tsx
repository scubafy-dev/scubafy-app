"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, LifeBuoy, Settings, Users, Wallet, Anchor, ClipboardList, FileText, GraduationCap, Car } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnyRecord } from "node:dns"
import { useEffect, useState } from "react";

interface NavLink {
  title: string
  label?: string
  icon: React.ComponentType<{ className?: string }>
  variant: "default" | "ghost"
  href: string
  id?:any
}

interface NavProps {
  links: NavLink[]
}

export function Nav({ links }: NavProps) {
  const pathname = usePathname()
  const { collapsed } = useSidebar()

  return (
    <div className="group flex flex-col gap-1 py-2">
      <TooltipProvider delayDuration={0}>
        {links.map((link, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={link.variant}
                className={cn(
                  "h-10 relative mx-2 justify-start",
                  collapsed ? "w-10" : "w-[176px]",
                  "transition-all duration-300 ease-in-out",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <Link href={link.href} className="flex items-center">
                  <link.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                  <span
                    className={cn(
                      "transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap font-medium",
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                    )}
                  >
                    {link.title}
                  </span>
                  {link.label && (
                    <span
                      className={cn(
                        "ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md",
                        collapsed ? "hidden" : "inline-block",
                      )}
                    >
                      {link.label}
                    </span>
                  )}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className={collapsed ? "block" : "hidden"}>
              {link.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}

export function DashboardNav() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();

  const links: NavLink[] = [
    {
      title: "Overview",
      icon: BarChart3,
      variant: pathname === "/" ? "default" : "ghost",
      href: "/",
      id: "overview"
    },
    {
      title: "Dive Trips",
      icon: Anchor,
      variant: pathname === "/dive-trips" ? "default" : "ghost",
      href: "/dive-trips",
      id: "diveTrips"
    },
    {
      title: "Customers",
      icon: Users,
      variant: pathname === "/customers" ? "default" : "ghost",
      href: "/customers",
      id: "customers"
    },
    {
      title: "Equipment",
      icon: LifeBuoy,
      variant: pathname === "/equipment" ? "default" : "ghost",
      href: "/equipment",
      id: "equipment"
    },
    {
      title: "Vehicle Management",
      icon: Car,
      variant: pathname === "/vehicles" ? "default" : "ghost",
      href: "/vehicles",
      id: "vehicles"
    },
    {
      title: "Staff",
      icon: Users,
      variant: pathname === "/staff" ? "default" : "ghost",
      href: "/staff",
      id: "staff"
    },
    {
      title: "Tasks",
      icon: ClipboardList,
      variant: pathname === "/tasks" ? "default" : "ghost",
      href: "/tasks",
      id: "tasks"
    },
    {
      title: "Course Tracker",
      icon: GraduationCap,
      variant: pathname === "/course-tracker" ? "default" : "ghost",
      href: "/course-tracker",
      id: "courseTracker"
    },
    {
      title: "Calendar",
      icon: Calendar,
      variant: pathname === "/calendar" ? "default" : "ghost",
      href: "/calendar",
      id: "calendar"
    },
    {
      title: "Settings",
      icon: Settings,
      variant: pathname === "/settings" ? "default" : "ghost",
      href: "/settings",
      id: "settings"
    },
  ];

  // State to hold filtered links
  const [filteredLinks, setFilteredLinks] = useState<NavLink[] | null>(null);

  useEffect(() => {
    // This runs only on the client
    const staffData = localStorage.getItem("staffData");
    if (staffData) {
      let staffPermissions: string[] = [];
      try {
        staffPermissions = JSON.parse(staffData).permissions || [];
      } catch {}
      console.log('staffPermissions',staffPermissions)
      setFilteredLinks(links.filter(link => staffPermissions.includes(link.id)));
    } else {
      setFilteredLinks(links); // Manager: show all
    }
  }, [pathname]);

  if (!filteredLinks) {
    // Optionally show a spinner or nothing while loading
    return null;
  }

  console.log('filteredLinks',filteredLinks)

  return (
    <div
      className="h-screen border-r border-border"
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div className="flex flex-col gap-1 py-4">
        <Nav links={filteredLinks} />
      </div>
    </div>
  );
}

