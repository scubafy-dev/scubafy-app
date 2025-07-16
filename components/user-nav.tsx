"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

export function UserNav() {
  const { data: session, status } = useSession();

  // State for staff info
  const [staffInfo, setStaffInfo] = useState<{ role?: string; status?: string; email?: string; image?: string } | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only runs on client
    const staffData = localStorage.getItem("staffData");
    if (staffData) {
      try {
        const parsed = JSON.parse(staffData);
        setStaffInfo({
          role: "staff",
          status: parsed.status,
          email: parsed.email,
          image: parsed.image, // if you store image in staffData
        });
      } catch {
        setStaffInfo(null);
      }
    } else {
      setStaffInfo(null);
    }
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  // Prefer staff info if present, else fallback to session
  const displayRole = staffInfo?.role || session?.user?.role;
  const displayStatus = staffInfo?.status;
  const displayEmail = staffInfo?.email || session?.user?.email || "instructor@divecenter.com";
  const displayImage = staffInfo?.image || session?.user?.image || "/placeholder.svg?height=32&width=32";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={displayImage} alt="Avatar" />
            <AvatarFallback>DC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {displayRole}
              {displayRole === "staff" && displayStatus ? (
                <span className="ml-2 text-xs text-muted-foreground">({displayStatus})</span>
              ) : null}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            localStorage.clear();
            signOut({ callbackUrl: "/signin" });
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
