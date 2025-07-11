import { NextResponse } from "next/server";
import { getMaintenanceEquipment } from "@/lib/equipment";

export async function GET() {
  try {
    const equipment = await getMaintenanceEquipment();
    return NextResponse.json(equipment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
  }
} 