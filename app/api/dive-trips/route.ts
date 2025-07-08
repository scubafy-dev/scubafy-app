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

    // Build the where clause for filtering
    let whereClause: any = {}
    
    if (!isAllCenters && diveCenterId) {
      whereClause.diveCenterId = diveCenterId
    }

    const diveTrips = await prisma.diveTrip.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        status: true,
        diveType: true,
        diveCenter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    // Transform the data to match the calendar event format
    const calendarEvents = diveTrips.map((trip: any) => ({
      id: trip.id,
      title: trip.title,
      date: trip.date,
      type: trip.diveType || "dive-trip",
      location: trip.location,
      status: trip.status,
    }))

    return NextResponse.json(calendarEvents)
  } catch (error) {
    console.error("Error fetching dive trips:", error)
    return NextResponse.json(
      { error: "Failed to fetch dive trips" },
      { status: 500 }
    )
  }
} 