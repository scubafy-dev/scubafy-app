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

    console.log("API Debug - Parameters:", { diveCenterId, isAllCenters })

    let whereClause: any = {}
    
    if (!isAllCenters && diveCenterId) {
      whereClause.diveCenterId = diveCenterId
    }

    console.log("API Debug - Where clause:", whereClause)

    // First, let's try a simple query to see if the table exists and has data
    const totalTrips = await prisma.diveTrip.count()
    console.log("API Debug - Total trips in database:", totalTrips)

    if (totalTrips === 0) {
      return NextResponse.json([])
    }

    const diveTrips = await prisma.diveTrip.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        status: true,
        diveCenter: {
          select: {
            id: true,
            name: true,
          },
        },
        participants: {
          select: {
            id: true,
            customer: {
              select: {
                id: true,
                fullName: true,
              }
            }
          }
        },
        _count: {
          select: {
            participants: true,
          }
        }
      },
      orderBy: {
        date: "asc",
      },
    })

    console.log("API Debug - Found trips:", diveTrips.length)

    // Transform the data
    const calendarEvents = diveTrips.map((trip: any) => ({
      id: trip.id,
      title: trip.title,
      date: trip.date,
      location: trip.location,
      status: trip.status,
      diveCenter: trip.diveCenter,
      participantCount: trip._count.participants,
      participants: trip.participants.map((p: any) => ({
        id: p.customer?.id || p.id,
        name: p.customer?.fullName || p.name,
      })),
    }))

    return NextResponse.json(calendarEvents)
  } catch (error) {
    console.error("Error fetching dive trips:", error)
    return NextResponse.json(
      { error: "Failed to fetch dive trips", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 