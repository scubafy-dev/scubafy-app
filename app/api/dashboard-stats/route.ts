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

    // Get upcoming dives count (next 7 days)
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    const upcomingDivesCount = await prisma.diveTrip.count({
      where: {
        ...whereClause,
        date: {
          gte: today,
          lte: nextWeek,
        },
      },
    })

    // Get total bookings (all time)
    const totalBookings = await prisma.diveTrip.count({
      where: whereClause,
    })

    // Get active divers count (customers who have participated in trips)
    const activeDivers = await prisma.customer.count({
      where: {
        ...whereClause,
        participants: {
          some: {},
        },
      },
    })

    // Get new divers this week
    const lastWeek = new Date()
    lastWeek.setDate(today.getDate() - 7)
    
    const newDivers = await prisma.customer.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: lastWeek,
        },
      },
    })

    // Calculate revenue (this would need to be implemented based on your revenue tracking)
    // For now, using a placeholder calculation
    const revenue = totalBookings * 150 // Placeholder calculation

    return NextResponse.json({
      upcomingDives: upcomingDivesCount,
      totalBookings,
      activeDivers,
      newDivers,
      revenue,
      bookingsChange: 12, // Placeholder
      revenueChange: 15, // Placeholder
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
} 