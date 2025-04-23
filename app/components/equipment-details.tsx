import { EquipmentItem } from "@/lib/mock-data/equipment"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface EquipmentDetailsProps {
  equipment: EquipmentItem
}

export function EquipmentDetails({ equipment }: EquipmentDetailsProps) {
  return (
    <Card className="mt-2 bg-muted/50">
      <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-semibold mb-1">Purchase Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Purchase Date:</span> {equipment.purchaseDate}</p>
            <p><span className="text-muted-foreground">Serial Number:</span> {equipment.serialNumber}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-1">Service Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Last Service:</span> {equipment.lastService}</p>
            <p><span className="text-muted-foreground">Next Service:</span> {equipment.nextService}</p>
          </div>
        </div>

        {equipment.trackUsage && (
          <div>
            <h4 className="font-semibold mb-1">Usage Statistics</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={cn(
                  "font-medium",
                  equipment.usageCount && equipment.usageLimit && 
                  equipment.usageCount >= equipment.usageLimit * 0.8 
                    ? "text-amber-500" 
                    : ""
                )}>
                  {equipment.usageCount}/{equipment.usageLimit} uses
                </span>
              </div>
              <Progress 
                value={equipment.usageCount && equipment.usageLimit 
                  ? (equipment.usageCount / equipment.usageLimit) * 100 
                  : 0} 
                className={cn(
                  "h-2",
                  equipment.usageCount && equipment.usageLimit && 
                  equipment.usageCount >= equipment.usageLimit 
                    ? "text-amber-500" 
                    : equipment.usageCount && equipment.usageLimit && 
                    equipment.usageCount >= equipment.usageLimit * 0.8 
                      ? "text-orange-400" 
                      : "text-blue-500"
                )}
              />
            </div>
          </div>
        )}

        {equipment.rentedTo && (
          <div>
            <h4 className="font-semibold mb-1">Rental Information</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Rented To:</span> {equipment.rentedTo}</p>
              {equipment.rentedToEmail && (
                <p><span className="text-muted-foreground">Contact:</span> {equipment.rentedToEmail}</p>
              )}
              {equipment.rentedSince && (
                <p><span className="text-muted-foreground">Since:</span> {equipment.rentedSince}</p>
              )}
              {equipment.rentedUntil && (
                <p><span className="text-muted-foreground">Until:</span> {equipment.rentedUntil}</p>
              )}
            </div>
          </div>
        )}

        <div className="col-span-2 md:col-span-3">
          <h4 className="font-semibold mb-1">Notes</h4>
          <p className="text-sm">{equipment.notes}</p>
        </div>
      </CardContent>
    </Card>
  )
} 