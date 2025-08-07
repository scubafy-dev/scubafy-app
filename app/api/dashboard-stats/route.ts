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

    // Get the user's dive centers (only centers owned by this manager)
    const userDiveCenters = await prisma.diveCenter.findMany({
      where: {
        ownerId: session.user.id
      },
      select: {
        id: true,
        name: true
      }
    })

    // If user has no dive centers, return empty stats
    if (userDiveCenters.length === 0) {
      return NextResponse.json({
        upcomingDives: 0,
        totalBookings: 0,
        activeDivers: 0,
        newDivers: 0,
        revenue: 0,
        bookingsChange: 0,
        revenueChange: 0,
        userDiveCenters: []
      })
    }

    let whereClause: any = {}
    
    if (!isAllCenters && diveCenterId) {
      // Verify the dive center belongs to the user
      const userCenterIds = userDiveCenters.map(center => center.id)
      if (!userCenterIds.includes(diveCenterId)) {
        return NextResponse.json({ error: "Unauthorized access to dive center" }, { status: 403 })
      }
      whereClause.diveCenterId = diveCenterId
    } else {
      // For "all centers" view, only show data from user's centers
      whereClause.diveCenterId = {
        in: userDiveCenters.map(center => center.id)
      }
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
      userDiveCenters: userDiveCenters
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
} 