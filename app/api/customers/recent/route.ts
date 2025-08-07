import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const diveCenterId = searchParams.get("diveCenterId");
    const isAllCenters = searchParams.get("isAllCenters") === "true";

    // Get the user's dive centers (only centers owned by this manager)
    const userDiveCenters = await prisma.diveCenter.findMany({
      where: {
        ownerId: session.user.id
      },
      select: {
        id: true,
        name: true
      }
    });

    // If user has no dive centers, return empty array
    if (userDiveCenters.length === 0) {
      return NextResponse.json({
        customers: []
      });
    }

    let whereClause: any = {};
    
    if (!isAllCenters && diveCenterId) {
      // Verify the dive center belongs to the user
      const userCenterIds = userDiveCenters.map(center => center.id);
      if (!userCenterIds.includes(diveCenterId)) {
        return NextResponse.json({ error: "Unauthorized access to dive center" }, { status: 403 });
      }
      whereClause.diveCenterId = diveCenterId;
    } else {
      // For "all centers" view, only show data from user's centers
      whereClause.diveCenterId = {
        in: userDiveCenters.map(center => center.id)
      };
    }

    // Get recent customers (last 5, ordered by creation date)
    const recentCustomers = await prisma.customer.findMany({
      where: whereClause,
      include: {
        diveCenter: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    return NextResponse.json({
      customers: recentCustomers
    });
  } catch (error) {
    console.error("Error fetching recent customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent customers" },
      { status: 500 }
    );
  }
} 