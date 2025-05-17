import prisma  from '@prisma/prisma';
import { redirect } from 'next/navigation';

export type FullDiveTrip = Awaited<ReturnType<typeof getAllDiveTrips>>[number];

export async function createDiveTrip(formData: FormData) {
    "use server";
    // Validate required form data fields
    // const requiredFields = [
    //   "title",
    //   "date",
    //   "location",
    //   "capacity",
    //   "price",
    //   "diveMaster",
    //   "instructor"
    // ];

    // for (const field of requiredFields) {
    //   if (!formData.get(field)) {
    //     throw new Error(`Missing required field: ${field}`);
    //   }
    // }

    // Set default values for required fields
    const requiredDefaults = {
        title: "Sample Dive Trip",
        date: new Date().toISOString(),
        location: "Blue Lagoon",
        capacity: 8,
        price: 120,
        diveMaster: "DM-001",
        instructor: "INS-001",
    };

    // For each required field, use the form value if present, otherwise use default
    for (const [key, defaultValue] of Object.entries(requiredDefaults)) {
        if (!formData.get(key)) {
            formData.append(key, defaultValue.toString());
        }
    }
    // Set default values for optional fields
    const defaultValues = {
        booked: 0,
        status: "upcoming",
        description: "",
        duration: "",
        difficulty: "beginner",
        center: null,
        vehicle: JSON.stringify({
            name: "Default Vehicle",
            type: "boat",
            capacity: 8,
        }),
        participants: JSON.stringify([]),
    };

    // For each optional field, use the form value if present, otherwise use default
    for (const [key, defaultValue] of Object.entries(defaultValues)) {
        if (!formData.get(key)) {
            formData.append(key, defaultValue);
        }
    }

    const id = formData.get("id") as string | null;
    const title = formData.get("title") as string;
    const dateStr = formData.get("date") as string;
    const location = formData.get("location") as string;
    const capacity = Number(formData.get("capacity"));
    const booked = Number(formData.get("booked"));
    const price = Number(formData.get("price"));
    const status = formData.get("status") as
        | "upcoming"
        | "in_progress"
        | "completed"
        | "cancelled";
    const diveMaster = formData.get("diveMaster") as string;
    const description = formData.get("description") as string;
    const duration = formData.get("duration") as string;
    const difficulty = formData.get("difficulty") as
        | "beginner"
        | "intermediate"
        | "advanced";
    const center = (formData.get("center") as string) || null;
    const instructor = formData.get("instructor") as string;

    const vehicle = JSON.parse(
        formData.get("vehicle") as string,
    ) as {
        name: string;
        type: "boat" | "speedboat" | "catamaran";
        capacity: number;
    };
    // const participants = JSON.parse(
    //     formData.get("participants") as string,
    // ) as Array<{
    //     name: string;
    //     certification: string;
    //     level: string;
    // }>;

    const participants: {
        name: string;
        certification: string;
        level: string;
    }[] = [];
    try {
        await prisma.diveTrip.create(
            {
                data: {
                    title,
                    date: new Date(dateStr),
                    location,
                    capacity,
                    booked,
                    price,
                    status,
                    diveMaster,
                    description,
                    duration,
                    difficulty,
                    center,
                    instructor,
                    vehicle: { create: vehicle },
                    participants: { createMany: { data: participants } },
                },
            },
        );
    } catch (error) {
        console.log("error: ", error);
    }

    // redirect("/diveTrips");
}


export const  getAllDiveTrips = async () => {
  return prisma.diveTrip.findMany({
    include: {
      vehicle: true,
      participants: true,
    },
    orderBy: {
      date: 'asc',
    },
  });
}

export async function updateDiveTrip(id: string | null, formData: FormData) {
    "use server";

    if(id === null){
        return;
    }

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const capacity = Number(formData.get("capacity"));
    const booked = Number(formData.get("booked"));
    const price = Number(formData.get("price"));
    const status = formData.get("status") as
        | "upcoming"
        | "in_progress"
        | "completed"
        | "cancelled";
    const diveMaster = formData.get("diveMaster") as string;
    const description = formData.get("description") as string;
    const duration = formData.get("duration") as string;
    const difficulty = formData.get("difficulty") as
        | "beginner"
        | "intermediate"
        | "advanced";
    const center = (formData.get("center") as string) || null;
    const instructor = formData.get("instructor") as string;


    try {
        await prisma.diveTrip.update(
            {
                where: {
                    id
                },
                data: {
                    title,
                    // date,
                    location,
                    capacity,
                    booked,
                    price,
                    // status,
                    diveMaster,
                    description,
                    // duration,
                    // difficulty,
                    center,
                    instructor,
                },
            },
        );
    } catch (error) {
        console.log("error: ", error);
    }

    // redirect("/diveTrips");
}

export const deleteDiveTrip = async (id: string) => {
    "use server"
      
    try{
        // Delete participants linked to this dive trip
        await prisma.participant.deleteMany({
            where: { diveTripId: id },
            })
        
        // Delete vehicle linked to this dive trip
        await prisma.vehicle.deleteMany({
        where: { diveTripId: id },
        })

        const res = await prisma.diveTrip.delete({
            where: {
                id
            }
        })
        // redirect("/dive-trip");
    }
    catch(error){
        console.log("error - ", error);
    }
}