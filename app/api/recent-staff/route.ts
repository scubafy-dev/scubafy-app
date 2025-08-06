import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const diveCenterId = searchParams.get("diveCenterId")
    const isAllCenters = searchParams.get("isAllCenters") === "true"

    let whereClause: any = {}
    
    if (!isAllCenters && diveCenterId) {
      whereClause.diveCenterId = diveCenterId
    }

    const recentStaff = await prisma.staff.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        roleTitle: true,
        status: true,
        createdAt: true,
        diveCenter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    })

    return NextResponse.json(recentStaff)
  } catch (error) {
    console.error("Error fetching recent staff:", error)
    return NextResponse.json(
      { error: "Failed to fetch recent staff", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 