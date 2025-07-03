"use server"

import prisma  from '@prisma/prisma';
import { connect } from 'http2';
import { redirect } from 'next/navigation';
import { useAuth } from './use-auth';

export type FullDiveTrip = Awaited<ReturnType<typeof getAllDiveTrips>>[number];

export async function createDiveTrip(formData: any, diveCenterId: string): Promise<void> {
    console.log('DiveTrip Data', formData, diveCenterId)
    
    // Validate fleetVehicleId first
    const fleetVehicleId = formData.fleetVehicleId as string;
    if (!fleetVehicleId) {
        throw new Error("fleetVehicleId is required");
    }
    
    // Check if the fleetVehicle exists
    try {
        const fleetVehicle = await prisma.fleetVehicle.findUnique({
            where: { id: fleetVehicleId }
        });
        if (!fleetVehicle) {
            throw new Error(`FleetVehicle with id ${fleetVehicleId} does not exist`);
        }
        console.log('Found fleetVehicle:', fleetVehicle);
    } catch (error) {
        console.error('Error validating fleetVehicle:', error);
        throw new Error(`Invalid fleetVehicleId: ${fleetVehicleId}`);
    }
    
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

    let participants: {
        name: string;
        certification: string;
        level: string;
        customerId: string;
    }[] = [];
    
    try {
        if (formData.participants && Array.isArray(formData.participants)) {
            participants = formData.participants.map((participant: any) => ({
                name: participant.name,
                certification: participant.certification,
                level: participant.level,
                customerId: participant?.customerId
            }));
        }
        console.log('Processed participants:', participants);
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
        console.log('Creating dive trip with data:', {
            title,
            date: dateStr,
            location,
            capacity,
            price,
            status,
            diveMaster,
            instructor,
            fleetVehicleId,
            participantsCount: participants.length,
            participants: participants
        });

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
                fleetVehicleId,
                participants: participants.length > 0 ? { createMany: { data: participants } } : undefined,
                diveCenterId,
                userId: session.user.id,
            },
        });
        
        console.log("Dive trip created successfully:", result);
    } catch (error) {
        console.error("Error creating dive trip:", error);
        console.error("Error details:", {
            participants,
            participantsLength: participants.length,
            formData: formData
        });
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
      fleetVehicle: true,
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

    // Validate fleetVehicleId first
    const fleetVehicleId = formData.fleetVehicleId as string;
    if (!fleetVehicleId) {
        throw new Error("fleetVehicleId is required");
    }
    
    // Check if the fleetVehicle exists
    try {
        const fleetVehicle = await prisma.fleetVehicle.findUnique({
            where: { id: fleetVehicleId }
        });
        if (!fleetVehicle) {
            throw new Error(`FleetVehicle with id ${fleetVehicleId} does not exist`);
        }
        console.log('Found fleetVehicle for update:', fleetVehicle);
    } catch (error) {
        console.error('Error validating fleetVehicle for update:', error);
        throw new Error(`Invalid fleetVehicleId: ${fleetVehicleId}`);
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

    // --- Handle participants like in createDiveTrip ---
    let participants: {
        name: string;
        certification: string;
        level: string;
        customerId: string;
    }[] = [];
    try {
        if (formData.participants && Array.isArray(formData.participants)) {
            participants = formData.participants.map((participant: any) => ({
                name: participant.name,
                certification: participant.certification,
                level: participant.level,
                customerId: participant?.customerId
            }));
        }
        console.log('Processed participants (update):', participants);
    } catch (error) {
        console.error("Error parsing participants data (update):", error);
        participants = [];
    }

    try {
        console.log('Updating dive trip with data:', {
            id,
            title,
            date,
            location,
            capacity,
            price,
            status,
            diveMaster,
            instructor,
            fleetVehicleId,
            participantsCount: participants.length,
            participants: participants
        });

        // Update the trip main fields
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
                    fleetVehicleId,
                },
            },
        );

        // --- Update participants ---
        console.log('Deleting existing participants for trip:', id);
        // Delete all existing participants for this trip
        await prisma.participant.deleteMany({ where: { diveTripId: id } });
        
        // Re-create participants if any
        if (participants.length > 0) {
            console.log('Creating new participants:', participants);
            await prisma.participant.createMany({
                data: participants.map(p => ({ ...p, diveTripId: id })),
            });
        } else {
            console.log('No participants to create');
        }
        
        console.log('Dive trip updated successfully');
    } catch (error) {
        console.error("Error updating dive trip:", error);
        console.error("Error details:", {
            participants,
            participantsLength: participants.length,
            formData: formData
        });
        throw error;
    }

    // redirect("/diveTrips");
}

export const deleteDiveTrip = async (id: string) => {
      
    try{
        // Delete participants linked to this dive trip
        await prisma.participant.deleteMany({
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