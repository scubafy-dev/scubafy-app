"use server"

import prisma  from '@prisma/prisma';
import { connect } from 'http2';
import { redirect } from 'next/navigation';
import { useAuth } from './use-auth';

export type FullDiveTrip = Awaited<ReturnType<typeof getAllDiveTrips>>[number];

export async function createDiveTrip(formData: FormData, diveCenterId: string) {

    const requiredDefaults = {
        title: "Sample Dive Trip",
        date: new Date().toISOString(),
        diveMaster: "DM-001",
        instructor: "INS-001",
    };

    for (const [key, defaultValue] of Object.entries(requiredDefaults)) {
        if (!formData.get(key)) {
            formData.append(key, defaultValue.toString());
        }
    }
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

    const { user } = await useAuth();
    if (!user) {
        console.error("User not authenticated");
        return;
    }

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
                    diveCenter: {
                        connect: {
                            id: diveCenterId
                        }
                    },
                    User: {
                        connect: {
                            id: user.id, 
                        }
                    }
                },
            },
        );
    } catch (error) {
        console.log("error: ", error);
    }

    // redirect("/diveTrips");
}


export const  getAllDiveTrips = async (diveCenterId: string | null) => {
    if(!diveCenterId) {
        console.error("Dive center ID is required to fetch dive trips.");
        return [];
    }

  return prisma.diveTrip.findMany({
    where: {
      diveCenterId,
    },
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
                    status,
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