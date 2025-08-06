import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/prisma"

export async function GET(request: NextRequest) {
  try {
    // Test basic database connection
    const diveCenters = await prisma.diveCenter.findMany({
      select: {
        id: true,
        name: true,
      },
      take: 5,
    })

    const diveTrips = await prisma.diveTrip.findMany({
      select: {
        id: true,
        title: true,
        diveCenterId: true,
      },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      diveCenters: diveCenters.length,
      diveTrips: diveTrips.length,
      sampleDiveCenters: diveCenters,
      sampleDiveTrips: diveTrips,
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Database connection failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
} 