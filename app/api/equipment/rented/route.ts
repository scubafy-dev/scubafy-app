import { NextResponse } from "next/server";
import { getRentedEquipment } from "@/lib/equipment";

export async function GET() {
  try {
    const equipment = await getRentedEquipment();
    return NextResponse.json(equipment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
  }
} 