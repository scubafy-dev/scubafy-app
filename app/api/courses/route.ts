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

    const courses = await prisma.course.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        status: true,
        certificationLevel: true,
        location: true,
        diveCenter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    })

    // Transform the data to match the calendar event format
    const calendarEvents = courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      startDate: course.startDate,
      endDate: course.endDate,
      type: "course",
      status: course.status,
      location: course.location,
      certificationLevel: course.certificationLevel,
    }))

    return NextResponse.json(calendarEvents)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
} 