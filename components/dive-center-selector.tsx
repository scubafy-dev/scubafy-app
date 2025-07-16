"use client";

import { useDiveCenter } from "@/lib/dive-center-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDiveCenter } from "@/lib/dive-center";
import { useRouter } from "next/navigation";
import { DiveCenter } from "@/app/generated/prisma";
export function DiveCenterSelector() {
  const {
    currentCenter,
    isAllCenters,
    centers,
    setDiveCenters,
    setCurrentCenter,
    setIsAllCenters,
  } = useDiveCenter();
  console.log('dive-center-selector',currentCenter)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  // Hydration-safe staff check
  const [isStaff, setIsStaff] = useState(false);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const staffData = localStorage.getItem("staffData");
    setIsStaff(!!staffData);
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  const handleSelectCenter = (centerId: string | null) => {
    if (centerId === "all") {
      setIsAllCenters(true);
      setCurrentCenter(null);
    } else {
      setIsAllCenters(false);
      const selectedCenter = centers.find((center) => center.id === centerId) ||
        null;
      setCurrentCenter(selectedCenter);
    }
  };

  const handleAddCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newCenter = await createDiveCenter(formData);
    setIsDialogOpen(false);
    // @ts-ignore
    setDiveCenters((prev:any) => [...prev, newCenter]);
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-4 pl-0 h-10"
            onClick={isStaff ? (e) => e.preventDefault() : undefined}
            tabIndex={isStaff ? -1 : 0}
            aria-disabled={isStaff}
            style={isStaff ? { pointerEvents: "none" } : {}}
          >
            <img
              src="/scubafy_logo.png"
              alt="Scubafy Logo"
              className="h-8 w-auto"
            />
            <span className="text-lg font-medium">
              {isAllCenters ? "All Dive Centers" : currentCenter?.name}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuItem
            className={isAllCenters ? "bg-muted" : ""}
            onClick={() => handleSelectCenter("all")}
            disabled
          >
            All Dive Centers
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {centers.map((center) => (
            <DropdownMenuItem
              key={center.id}
              className={!isAllCenters && currentCenter?.id === center.id
                ? "bg-muted"
                : ""}
              onClick={() => handleSelectCenter(center.id)}
              disabled={isStaff}
            >
              {center.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={isStaff}>
                <Plus className="h-4 w-4 mr-2" />
                Add Dive Center
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Dive Center</DialogTitle>
                <DialogDescription>
                  Enter the details for the new dive center location.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCenter}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Center Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Sea Explorers Cebu"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Cebu, Philippines"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Center</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
