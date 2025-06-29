"use server"

import prisma  from '@prisma/prisma';
import { connect } from 'http2';
import { redirect } from 'next/navigation';
import { useAuth } from './use-auth';

export type FullDiveTrip = Awaited<ReturnType<typeof getAllDiveTrips>>[number];

export async function createDiveTrip(formData: any, diveCenterId: string): Promise<void> {
    console.log('DiveTrip Data', formData, diveCenterId)
    const requiredDefaults = {
        title: "Sample Dive Trip",
        location: "Sample Location",
        capacity: 8,
        price: 0,
        diveMaster: "DM-001",
        instructor: "INS-001",
    };

    // Apply defaults for missing values
    for (const [key, defaultValue] of Object.entries(requiredDefaults)) {
        if (!formData[key]) {
            formData[key] = defaultValue;
        }
    }
    
    const defaultValues = {
        booked: 0,
        status: "upcoming",
        description: "",
        duration: "",
        difficulty: "beginner",
        center: null,
        vehicle: {
            name: "Default Vehicle",
            type: "boat",
            capacity: 8,
        },
        participants: [],
    };

    // Apply defaults for missing values
    for (const [key, defaultValue] of Object.entries(defaultValues)) {
        if (!formData[key]) {
            formData[key] = defaultValue;
        }
    }

    const id = formData.id as string | null;
    const title = formData.title as string;
    const dateStr = formData.date ? new Date(formData.date).toISOString() : new Date().toISOString();
    const location = formData.location as string;
    const capacity = Number(formData.capacity);
    const booked = Number(formData.booked);
    const price = Number(formData.price);
    const status = formData.status as
        | "upcoming"
        | "in_progress"
        | "completed"
        | "cancelled";
    const diveMaster = formData.diveMaster as string;
    const description = formData.description as string;
    const duration = formData.duration as string;
    const difficulty = formData.difficulty as
        | "beginner"
        | "intermediate"
        | "advanced";
    const center = (formData.center as string) || null;
    const instructor = formData.instructor as string;

    let vehicle;
    try {
        const vehicleData = formData.vehicle || {
            name: "Default Vehicle",
            type: "boat" as const,
            capacity: 8,
        };
        vehicle = {
            name: vehicleData.name,
            type: vehicleData.type as "boat" | "speedboat" | "catamaran",
            capacity: vehicleData.capacity
        };
    } catch (error) {
        console.error("Error parsing vehicle data:", error);
        vehicle = {
            name: "Default Vehicle",
            type: "boat" as const,
            capacity: 8,
        };
    }

    let participants: {
        name: string;
        certification: string;
        level: string;
    }[] = [];
    
    try {
        if (formData.participants) {
            participants = Array.isArray(formData.participants) ? formData.participants : [];
        }
    } catch (error) {
        console.error("Error parsing participants data:", error);
        participants = [];
    }

    const session = await useAuth();
    if (!session?.user?.id) {
        console.error("User not authenticated or missing user ID");
        throw new Error("User not authenticated");
    }

    try {
        const result = await prisma.diveTrip.create({
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
                        id: session.user.id, 
                    }
                }
            },
        });
        
        console.log("Dive trip created successfully:", result);
    } catch (error) {
        console.error("Error creating dive trip:", error);
        throw error;
    }
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

export async function updateDiveTrip(id: string | null, formData: any) {

    if(id === null){
        return;
    }

    const title = formData.title as string;
    const date = formData.date ? new Date(formData.date).toISOString() : new Date().toISOString();
    const location = formData.location as string;
    const capacity = Number(formData.capacity);
    const booked = Number(formData.booked);
    const price = Number(formData.price);
    const status = formData.status as
        | "upcoming"
        | "in_progress"
        | "completed"
        | "cancelled";
    const diveMaster = formData.diveMaster as string;
    const description = formData.description as string;
    const duration = formData.duration as string;
    const difficulty = formData.difficulty as
        | "beginner"
        | "intermediate"
        | "advanced";
    const center = (formData.center as string) || null;
    const instructor = formData.instructor as string;


    try {
        await prisma.diveTrip.update(
            {
                where: {
                    id
                },
                data: {
                    title,
                    date,
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