import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/prisma"

export async function POST(request: NextRequest) {
  try {
    // Get the first dive center
    const diveCenter = await prisma.diveCenter.findFirst()
    
    if (!diveCenter) {
      return NextResponse.json({ error: "No dive center found" }, { status: 404 })
    }

    // Create some test dive trips
    const testTrips = [
      {
        title: "Coral Reef Exploration",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        location: "Dauin Marine Sanctuary",
        status: "upcoming",
        diveCenterId: diveCenter.id,
        userId: diveCenter.ownerId,
      },
      {
        title: "Muck Diving Adventure",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: "Car Cemetery",
        status: "upcoming",
        diveCenterId: diveCenter.id,
        userId: diveCenter.ownerId,
      },
      {
        title: "Night Dive Experience",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        location: "Sahara Beach",
        status: "upcoming",
        diveCenterId: diveCenter.id,
        userId: diveCenter.ownerId,
      },
    ]

    const createdTrips = await Promise.all(
      testTrips.map(trip => prisma.diveTrip.create({ data: trip }))
    )

    return NextResponse.json({
      success: true,
      message: `Created ${createdTrips.length} test dive trips`,
      trips: createdTrips
    })
  } catch (error) {
    console.error("Error seeding dive trips:", error)
    return NextResponse.json(
      { error: "Failed to seed dive trips", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 