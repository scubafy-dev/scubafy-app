import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, DollarSign, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { Equipment } from "@/lib/equipment";

interface EquipmentStatsProps {
  equipment: Equipment[];
}

export function EquipmentStats({ equipment }: EquipmentStatsProps) {
  const router = useRouter();

  // Calculate equipment statistics
  const totalEquipment = equipment?.length || 0;
  const availableEquipment =
    equipment?.filter((item) => item.status === "available").length || 0;
  const inUseEquipment =
    equipment?.filter((item) => item.status === "in_use").length || 0;
  const maintenanceEquipment =
    equipment?.filter((item) => item.status === "maintenance").length || 0;
  const rentedEquipment =
    equipment?.filter((item) => item.status === "rented").length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEquipment}</div>
          <Progress value={100} className="h-2 mt-2" />
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer hover:border-green-500 transition-colors"
        onClick={() => router.push("/equipment/available")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableEquipment}</div>
          <Progress
            value={(availableEquipment / totalEquipment) * 100}
            className="h-2 mt-2 text-green-500"
          />
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => router.push("/equipment/in-use")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Use</CardTitle>
          <History className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inUseEquipment}</div>
          <Progress
            value={(inUseEquipment / totalEquipment) * 100}
            className="h-2 mt-2 text-blue-500"
          />
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={() => router.push("/equipment/rented")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rented</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rentedEquipment}</div>
          <Progress
            value={(rentedEquipment / totalEquipment) * 100}
            className="h-2 mt-2 text-primary"
          />
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer hover:border-amber-500 transition-colors"
        onClick={() => router.push("/equipment/maintenance")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maintenanceEquipment}</div>
          <Progress
            value={(maintenanceEquipment / totalEquipment) * 100}
            className="h-2 mt-2 text-amber-500"
          />
        </CardContent>
      </Card>
    </div>
  );
}
