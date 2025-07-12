import { NextRequest, NextResponse } from "next/server";
import { verifyStaffCode } from "@/lib/staffs";

export async function POST(request: NextRequest) {
  try {
    const { staffCode, diveCenterId } = await request.json();

    console.log("Verifying staff code:", { staffCode, diveCenterId });

    if (!staffCode || !diveCenterId) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Staff code and dive center ID are required" },
        { status: 400 }
      );
    }

    const result = await verifyStaffCode(staffCode, diveCenterId);
    console.log("Verification result:", result);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      staff: result.staff,
    });
  } catch (error) {
    console.error("Error in verify-staff-code API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 