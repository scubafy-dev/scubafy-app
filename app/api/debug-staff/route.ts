import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get all staff members
    const allStaff = await prisma.staff.findMany({
      include: {
        diveCenter: {
          select: {
            id: true,
            name: true,
          },
        },
        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });

    // Get all dive centers
    const diveCenters = await prisma.diveCenter.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      staff: allStaff.map(staff => ({
        id: staff.id,
        fullName: staff.fullName,
        email: staff.email,
        staffCode: staff.staffCode,
        status: staff.status,
        diveCenterId: staff.diveCenterId,
        diveCenterName: staff.diveCenter?.name,
        permissions: staff.permissions.map(p => p.permission),
      })),
      diveCenters,
      totalStaff: allStaff.length,
      staffWithCodes: allStaff.filter(s => s.staffCode).length,
    });
  } catch (error) {
    console.error("Error in debug-staff API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 