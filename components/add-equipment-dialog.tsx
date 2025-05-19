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
import { EquipmentFormType } from "@/lib/equipment";

interface AddEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionCreate: (formData: EquipmentFormType) => void;
}

export function AddEquipmentDialog(
  { open, onOpenChange, actionCreate }: AddEquipmentDialogProps,
) {
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "rental">(
    "basic",
  );
  const [formData, setFormData] = useState({
    type: "",
    sku: "",
    make: "",
    model: "",
    serialNumber: "",
    size: "",
    location: "",
    condition: "",
    quantity: "1",
    trackMinQuantity: false,
    trackUsage: false,
    lastInspection: "",
    nextInspection: "",
    itemValue: "",
    rentalRate: "",
    rentalTimeframe: "Per Dive",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData);
    actionCreate(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-xl">Add New Equipment</DialogTitle>
        </DialogHeader>

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
                <Input
                  id="type"
                  placeholder="Scuba Tank, BCD, Regulator, etc."
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="h-9"
                />
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
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="condition" className="text-sm font-medium">
                  Condition
                </Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    handleInputChange("condition", value)}
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
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)}
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
            Add Equipment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
