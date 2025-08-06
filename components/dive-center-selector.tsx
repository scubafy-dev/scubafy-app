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
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

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
  const { data: session } = useSession();

  // Subscription state
  const [subscriptionData, setSubscriptionData] = useState<{
    hasPaidSubscription: boolean;
    hasFreeSubscription: boolean;
    maxDiveCenters?: number;
    planType?: string;
    status?: string;
  } | null>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [isCreatingCenter, setIsCreatingCenter] = useState(false);
  const { toast } = useToast();

  // Hydration-safe staff check
  const [isStaff, setIsStaff] = useState(false);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const staffData = localStorage.getItem("staffData");
    setIsStaff(!!staffData);
    setIsReady(true);
  }, []);

  // Check subscription when component mounts or session changes
  useEffect(() => {
    const checkSubscription = async () => {
      if (!session?.user?.email) return;
      
      setIsCheckingSubscription(true);
      
      try {
        const response = await fetch("/api/check-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast({
            title: "Subscription Check Failed",
            description: "Failed to check subscription status. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setSubscriptionData(data);
      } catch (error) {
        console.error("Error checking subscription:", error);
        toast({
          title: "Subscription Error",
          description: "Failed to verify subscription. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [session?.user?.email]);

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
    
    // Check subscription before creating dive center
    if (!subscriptionData?.hasPaidSubscription && !subscriptionData?.hasFreeSubscription) {
      toast({
        title: "Subscription Required",
        description: "You need a subscription to create dive centers.",
        variant: "destructive",
      });
      return;
    }

    if (subscriptionData.maxDiveCenters && centers.length >= subscriptionData.maxDiveCenters) {
      toast({
        title: "Dive Center Limit Reached",
        description: `You have reached the maximum number of dive centers (${subscriptionData.maxDiveCenters}) for your ${subscriptionData.planType} plan.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreatingCenter(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const result = await createDiveCenter(formData);
      
      if (!result.success) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      
      setIsDialogOpen(false);
      // @ts-ignore
      setDiveCenters((prev:any) => [...prev, result.data]);
      
      toast({
        title: "Success",
        description: "Dive center created successfully!",
        variant: "default",
      });
      
      router.refresh();
    } catch (error) {
      console.error("Error creating dive center:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create dive center";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreatingCenter(false);
    }
  };

  const canAddDiveCenter = (subscriptionData?.hasPaidSubscription || subscriptionData?.hasFreeSubscription) && 
    (!subscriptionData.maxDiveCenters || centers.length < subscriptionData.maxDiveCenters);

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
              {centers.length === 0 
                ? "No Dive Centers" 
                : isAllCenters 
                  ? "All Dive Centers" 
                  : currentCenter?.name}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          {centers.length === 0 ? (
            <DropdownMenuItem disabled className="text-center text-muted-foreground">
              No dive centers found
            </DropdownMenuItem>
          ) : (
            <>
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
            </>
          )}
          <DropdownMenuSeparator />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()} 
                disabled={isStaff || !canAddDiveCenter}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Dive Center
                {subscriptionData?.maxDiveCenters && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {centers.length}/{subscriptionData.maxDiveCenters}
                    {subscriptionData.status === "free" && " (Free)"}
                  </span>
                )}
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Dive Center</DialogTitle>
                <DialogDescription>
                  {centers.length === 0 
                    ? "Create your first dive center to get started."
                    : "Enter the details for the new dive center location."}
                  {subscriptionData?.maxDiveCenters && (
                    <span className="block mt-2 text-sm text-muted-foreground">
                      {subscriptionData.status === "free" 
                        ? "Free plan allows 1 dive center."
                        : `You can create up to ${subscriptionData.maxDiveCenters} dive centers with your ${subscriptionData.planType} plan.`
                      }
                    </span>
                  )}
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
                  <Button 
                    type="submit" 
                    disabled={isCheckingSubscription || isCreatingCenter || !canAddDiveCenter}
                  >
                    {isCreatingCenter ? "Creating..." : isCheckingSubscription ? "Checking..." : "Add Center"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
