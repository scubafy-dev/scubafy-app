"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Equipment, EquipmentFormType } from "@/lib/equipment";
import { ActionMode } from "@/types/all";
import { useRouter } from "next/navigation";
import { createEquipment, updateEquipment } from "@/lib/equipment";
import { Condition, EquipmentStatus, EquipmentType } from "@app/generated/prisma";
import { useDiveCenter } from "@/lib/dive-center-context";
import { useToast } from "./ui/use-toast";

interface AddEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  mode: ActionMode;
  handleEquipmentCreated?:any;
}

export function AddEquipmentDialog(
  {handleEquipmentCreated, open, onOpenChange, equipment, mode }: AddEquipmentDialogProps,
) {
  const { currentCenter, isAllCenters, getCenterSpecificData } =
    useDiveCenter();
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "rental">(
    "basic",
  );
  // Define predefined equipment types
  const predefinedTypes = ["BCD", "Regulator", "Wetsuit", "DiveComputer", "Fins"];
  
  // Determine initial type and customType for editing
  const getInitialType = () => {
    if (!equipment?.type) return "BCD";
    
    // If the equipment type is not in predefined list, it's a custom type
    if (!predefinedTypes.includes(equipment.type)) {
      return "Other";
    }
    return equipment.type;
  };
  
  const getInitialCustomType = () => {
    if (!equipment?.type) return "";
    
    // If the equipment type is not in predefined list, use it as custom type
    if (!predefinedTypes.includes(equipment.type)) {
      return equipment.type;
    }
    return "";
  };
  
  // Helper function to format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null | undefined): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
  };
  
  const [formData, setFormData] = useState({
    type: getInitialType(),
    customType: getInitialCustomType(),
    sku: equipment?.sku ?? "",
    make: equipment?.make ?? "",
    brand: equipment?.brand ?? "",
    model: equipment?.model ?? "",
    purchaseDate: equipment?.purchaseDate?.toISOString() ??
      new Date().toISOString(),
    serialNumber: equipment?.serialNumber ?? "",
    size: equipment?.size ?? "",
    location: equipment?.location ?? "",
    status: equipment?.status ?? EquipmentStatus.available,
    condition: equipment?.condition ?? Condition.excellent,
    usageCount: equipment?.usageCount?.toString() ?? "",
    usageLimit: equipment?.usageLimit?.toString() ?? "",
    notes: equipment?.notes ?? "",
    quantity: "1",
    trackMinQuantity: false,
    trackUsage: false,
    lastInspection: formatDateForInput(equipment?.lastService),
    nextInspection: formatDateForInput(equipment?.nextService),
    itemValue: "",
    rentalRate: "",
    rentalTimeframe: "Per Dive",
  });
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!currentCenter?.id) {
      toast({
        title: "Error",
        description: "Dive center not found.",
      });
      return;
    }
    // Handle form submission
    console.log('======>', formData);
    if (mode === ActionMode.create) {
      // Map form data to match EquipmentFormType interface
      const equipmentData = {
        type: formData.type === "Other" ? formData.customType : formData.type,
        sku: formData.sku || null,
        make: formData.make || null,
        brand: formData.brand || "Generic",
        model: formData.model,
        serialNumber: formData.serialNumber,
        size: formData.size || null,
        location: formData.location || null,
        purchaseDate: formData.purchaseDate,
        lastInspection: formData.lastInspection,
        nextInspection: formData.nextInspection,
        status: formData.status as EquipmentFormType["status"],
        condition: formData.condition as EquipmentFormType["condition"],
        usageCount: formData.usageCount || null,
        usageLimit: formData.usageLimit || null,
        notes: formData.notes || "",
      };

      const res = await createEquipment(equipmentData, currentCenter?.id);
      console.log('create response', res);

      if (res?.success) {
        router.refresh();
        handleEquipmentCreated()
      } else {
        console.error('Failed to create equipment:', res?.error);
      }
    } else {
      if (equipment) {
        // Map form data to match EquipmentFormType interface for update
        const equipmentData = {
          type: formData.type === "Other" ? formData.customType : formData.type,
          sku: formData.sku || null,
          make: formData.make || null,
          brand: formData.brand || "Generic",
          model: formData.model,
          serialNumber: formData.serialNumber,
          size: formData.size || null,
          location: formData.location || null,
          purchaseDate: formData.purchaseDate,
          lastInspection: formData.lastInspection,
          nextInspection: formData.nextInspection,
          status: formData.status as EquipmentFormType["status"],
          condition: formData.condition as EquipmentFormType["condition"],
          usageCount: formData.usageCount || null,
          usageLimit: formData.usageLimit || null,
          notes: formData.notes || "",
        };

        const res = await updateEquipment(equipment.id, equipmentData);
        console.log('update response', res);

        if (res?.success) {
          router.refresh();
          handleEquipmentCreated()
        } else {
          console.error('Failed to update equipment:', res?.error);
        }
      }
    }
    onOpenChange(false);
  };

  return (
    <>
      <div className="flex border-b">
        <button
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === "basic"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-primary",
          )}
          onClick={() => setActiveTab("basic")}
        >
          Basic Info
        </button>
        <button
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === "details"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-primary",
          )}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === "rental"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-primary",
          )}
          onClick={() => setActiveTab("rental")}
        >
          Rental Info
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === "basic" && (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="type" className="text-sm font-medium">
                Equipment Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select equipment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BCD">BCD</SelectItem>
                  <SelectItem value="Regulator">Regulator</SelectItem>
                  <SelectItem value="Wetsuit">Wetsuit</SelectItem>
                  <SelectItem value="DiveComputer">Dive Computer</SelectItem>
                  <SelectItem value="Fins">Fins</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.type === "Other" && (
                <Input
                  placeholder="Enter custom equipment type"
                  value={formData.customType}
                  onChange={(e) => handleInputChange("customType", e.target.value)}
                  className="h-9 mt-2"
                />
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sku" className="text-sm font-medium">SKU</Label>
              <Input
                id="sku"
                placeholder="SK-12345"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="make" className="text-sm font-medium">
                Make
              </Label>
              <Input
                id="make"
                placeholder="Manufacturer name"
                value={formData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="model" className="text-sm font-medium">
                Model
              </Label>
              <Input
                id="model"
                placeholder="Model name/number"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="serialNumber" className="text-sm font-medium">
                Serial Number
              </Label>
              <Input
                id="serialNumber"
                placeholder="ST-12345"
                value={formData.serialNumber}
                onChange={(e) =>
                  handleInputChange("serialNumber", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="size" className="text-sm font-medium">
                Size
              </Label>
              <Input
                id="size"
                placeholder="80 cu ft / Medium / etc."
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="location" className="text-sm font-medium">
                Storage Location
              </Label>
              <Input
                id="location"
                placeholder="Warehouse A, Shelf B3, etc."
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="condition" className="text-sm font-medium">
                Condition
              </Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleInputChange("condition", value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in_use">In use</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="location" className="text-sm font-medium">
                Wear Rate (Usage Count / Usage Limit)
              </Label>
              <div className="flex flex-row gap-2 items-center">
                <Input
                  id="usageCount"
                  placeholder="Usage Count"
                  value={formData.usageCount}
                  onChange={(e) =>
                    handleInputChange("usageCount", e.target.value)}
                  className="h-9"
                />
                <div>/</div>
                <Input
                  id="usageLimit"
                  placeholder="Usage Limit"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    handleInputChange("usageLimit", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-start space-x-2 pt-1">
              <Checkbox
                id="trackMinQuantity"
                checked={formData.trackMinQuantity}
                onCheckedChange={(checked) =>
                  handleInputChange("trackMinQuantity", checked as boolean)}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="trackMinQuantity"
                  className="text-sm font-medium"
                >
                  Track Minimum Quantity
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable low stock alerts
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="trackUsage"
                checked={formData.trackUsage}
                onCheckedChange={(checked) =>
                  handleInputChange("trackUsage", checked as boolean)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="trackUsage" className="text-sm font-medium">
                  Track Usage
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable usage tracking for maintenance alerts
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="grid gap-1.5">
                <Label htmlFor="lastInspection" className="text-sm font-medium">
                  Last Inspection
                </Label>
                <Input
                  id="lastInspection"
                  type="date"
                  value={formData.lastInspection}
                  onChange={(e) =>
                    handleInputChange("lastInspection", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="nextInspection" className="text-sm font-medium">
                  Next Inspection
                </Label>
                <Input
                  id="nextInspection"
                  type="date"
                  value={formData.nextInspection}
                  onChange={(e) =>
                    handleInputChange("nextInspection", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "rental" && (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="itemValue" className="text-sm font-medium">
                Item Value
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="itemValue"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-6 h-9"
                  placeholder="250.00"
                  value={formData.itemValue}
                  onChange={(e) =>
                    handleInputChange("itemValue", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="rentalRate" className="text-sm font-medium">
                Rental Rate
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="rentalRate"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-6 h-9"
                  placeholder="15.00"
                  value={formData.rentalRate}
                  onChange={(e) =>
                    handleInputChange("rentalRate", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label
                htmlFor="rentalTimeframe"
                className="text-sm font-medium"
              >
                Rental Timeframe
              </Label>
              <Select
                value={formData.rentalTimeframe}
                onValueChange={(value) =>
                  handleInputChange("rentalTimeframe", value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Per Dive">Per Dive</SelectItem>
                  <SelectItem value="Per Day">Per Day</SelectItem>
                  <SelectItem value="Per Week">Per Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 p-4 border-t bg-muted/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit}>
          {mode === ActionMode.create ? "Add Equipment" : "Update Equipment"}
        </Button>
      </div>
    </>
  );
}
