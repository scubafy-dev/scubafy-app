import { NextRequest, NextResponse } from "next/server";
import { deleteDiveCenter } from "@/lib/dive-center";

export async function DELETE(request: NextRequest) {
  try {
    // Accept centerId from query or JSON body
    const { searchParams } = new URL(request.url);
    let centerId = searchParams.get("centerId");
    if (!centerId) {
      // Try to get from JSON body
      const body = await request.json().catch(() => null);
      centerId = body?.centerId;
    }
    if (!centerId) {
      return NextResponse.json({ error: "Dive center ID is required" }, { status: 400 });
    }
    const updatedCenters = await deleteDiveCenter(centerId);
    return NextResponse.json({ success: true, diveCenters: updatedCenters });
  } catch (error) {
    console.error("Error in DELETE /api/dive-center:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete dive center" }, { status: 500 });
  }
} 