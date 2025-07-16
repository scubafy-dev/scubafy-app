import { NextRequest, NextResponse } from "next/server";
import { verifyStaffCode } from "@/lib/staffs";

export async function POST(request: NextRequest) {
  try {
    const { staffCode, userEmail } = await request.json();

    console.log("Verifying staff code:", { staffCode, userEmail });

    if (!staffCode || !userEmail) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Staff code and user email are required" },
        { status: 400 }
      );
    }

    const result = await verifyStaffCode(staffCode, userEmail);
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
      diveCenter: result.diveCenter,
    });
  } catch (error) {
    console.error("Error in verify-staff-code API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 