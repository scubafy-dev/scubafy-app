import { NextRequest, NextResponse } from "next/server";
import { getDiveCenterByStaffCode } from "@/lib/staffs";

export async function POST(request: NextRequest) {
  try {
    const { staffCode } = await request.json();

    console.log("Getting dive center by staff code:", { staffCode });

    if (!staffCode) {
      console.log("Missing staff code");
      return NextResponse.json(
        { error: "Staff code is required" },
        { status: 400 }
      );
    }

    const result = await getDiveCenterByStaffCode(staffCode);
    console.log("Result:", result);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      diveCenter: result.diveCenter,
      staff: result.staff,
    });
  } catch (error) {
    console.error("Error in dive-center-by-staff-code API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 