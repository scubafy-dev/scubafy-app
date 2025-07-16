"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const permissionToRoute: Record<string, string> = {
  overview: "/",
  diveTrips: "/dive-trips",
  customers: "/customers",
  equipment: "/equipment",
  vehicles: "/vehicles",
  staff: "/staff",
  tasks: "/tasks",
  courseTracker: "/course-tracker",
  calendar: "/calendar",
  settings: "/settings",
};

export function StaffAutoRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const staffData = localStorage.getItem("staffData");
    if (staffData) {
      try {
        const permissions: string[] = JSON.parse(staffData).permissions || [];
        // If staff is on / and does not have overview permission, redirect
        if (pathname === "/" && !permissions.includes("overview")) {
          // Find the first permitted route
          const firstPerm = permissions.find((perm) => permissionToRoute[perm]);
          if (firstPerm) {
            router.replace(permissionToRoute[firstPerm]);
          }
        }
      } catch {}
    }
  }, [router, pathname]);

  return null;
} 