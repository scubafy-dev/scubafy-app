import { NextRequest, NextResponse } from "next/server";
import { createStaff, verifyStaffCode } from "@/lib/staffs";

export async function POST(request: NextRequest) {
  try {
    const { action, diveCenterId } = await request.json();

    if (action === "create-test-staff") {
      // Create a test staff member
      const formData = new FormData();
      formData.append("name", "Test Staff");
      formData.append("email", "test@example.com");
      formData.append("phone", "+1234567890");
      formData.append("role", "Test Role");
      formData.append("status", "active");
      formData.append("access", "diveTrips");
      formData.append("access", "equipment");

      const result = await createStaff(formData, diveCenterId);
      
      return NextResponse.json({
        success: true,
        message: "Test staff created",
        staffCode: result.staffCode,
        staff: result.data,
      });
    }

    if (action === "verify-test-staff") {
      const { staffCode } = await request.json();
      const result = await verifyStaffCode(staffCode, diveCenterId);
      
      return NextResponse.json({
        success: result.success,
        message: result.message,
        staff: result.staff,
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in test-staff-code API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 