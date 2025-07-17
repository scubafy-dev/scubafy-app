"use server"

import prisma  from '@prisma/prisma';
import { connect } from 'http2';
import { redirect } from 'next/navigation';
import { useAuth } from './use-auth';
import { getStaffById } from './staffs';

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
    const center = (formData.center as string) || null;
    const instructor = formData.instructor as string;
    const diveType = formData.diveType as string | undefined;
    
    // Handle multiple instructors
    let instructorIds: string[] = [];
    if (formData.selectedInstructorIds && Array.isArray(formData.selectedInstructorIds)) {
        instructorIds = formData.selectedInstructorIds;
    }
    
    // Handle multiple dive masters
    let diveMasterIds: string[] = [];
    if (formData.selectedDiveMasterIds && Array.isArray(formData.selectedDiveMasterIds)) {
        diveMasterIds = formData.selectedDiveMasterIds;
    }
    
    // For backward compatibility, join multiple instructor IDs with comma
    const instructorString = instructorIds.length > 0 ? instructorIds.join(',') : instructor;
    
    // For backward compatibility, join multiple dive master IDs with comma
    const diveMasterString = diveMasterIds.length > 0 ? diveMasterIds.join(',') : formData.diveMaster;

    let participants: {
        name: string;
        certification: string;
        level: string;
        customerId?: string;
    }[] = [];
    
    try {
        if (formData.participants && Array.isArray(formData.participants)) {
            participants = formData.participants.map((participant: any) => ({
                name: participant.name,
                certification: participant.certification,
                level: participant.level,
                customerId: participant?.customerId || undefined
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
            diveMaster: diveMasterString,
            instructor: instructorString,
            fleetVehicleId,
            participantsCount: participants.length,
            participants: participants,
            expenses: formData.expenses // log for debug
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
                diveMaster: diveMasterString,
                description: formData.description,
                duration: formData.duration,
                difficulty: formData.difficulty,
                center,
                instructor: instructorString,
                fleetVehicleId,
                diveType,
                expenses: formData.expenses ?? {},
                participants: participants.length > 0 ? { createMany: { data: participants } } : undefined,
                diveCenterId,
                userId: session.user.id,
                // Create instructor assignments
                instructorAssignments: instructorIds.length > 0 ? {
                    create: instructorIds.map(staffId => ({ staffId }))
                } : undefined,
                // Create dive master assignments
                diveMasterAssignments: diveMasterIds.length > 0 ? {
                    create: diveMasterIds.map(staffId => ({ staffId }))
                } : undefined,
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

  const trips = await prisma.diveTrip.findMany({
    where: {
      diveCenterId,
    },
    include: {
      fleetVehicle: true,
      participants: true,
      instructorAssignments: {
        include: {
          staff: true
        }
      },
      diveMasterAssignments: {
        include: {
          staff: true
        }
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Helper function to fetch full staff data for instructor IDs
  const fetchInstructorData = async (instructorString: string | null) => {
    if (!instructorString) return [];
    
    const instructorIds = instructorString.split(',').filter(id => id.trim() !== '');
    const instructorData = [];
    
    for (const id of instructorIds) {
      try {
        const staff = await getStaffById(id.trim());
        if (staff) {
          instructorData.push(staff);
        }
      } catch (error) {
        console.error(`Error fetching staff with ID ${id}:`, error);
      }
    }
    
    return instructorData;
  };

  // Helper function to fetch full staff data for dive master IDs
  const fetchDiveMasterData = async (diveMasterString: string | null) => {
    if (!diveMasterString) return [];
    
    const diveMasterIds = diveMasterString.split(',').filter(id => id.trim() !== '');
    const diveMasterData = [];
    
    for (const id of diveMasterIds) {
      try {
        const staff = await getStaffById(id.trim());
        if (staff) {
          diveMasterData.push(staff);
        }
      } catch (error) {
        console.error(`Error fetching staff with ID ${id}:`, error);
      }
    }
    
    return diveMasterData;
  };

  // Fetch full instructor and dive master data for each trip
  const tripsWithStaffData = await Promise.all(
    trips.map(async (trip) => {
      const instructorData = await fetchInstructorData(trip.instructor);
      const diveMasterData = await fetchDiveMasterData(trip.diveMaster);
      return {
        ...trip,
        instructorData, // Add the full instructor data
        diveMasterData, // Add the full dive master data
      };
    })
  );

  return tripsWithStaffData;
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
    const center = (formData.center as string) || null;
    const instructor = formData.instructor as string;
    const diveType = formData.diveType as string | undefined;
    
    // Handle multiple instructors
    let instructorIds: string[] = [];
    if (formData.selectedInstructorIds && Array.isArray(formData.selectedInstructorIds)) {
        instructorIds = formData.selectedInstructorIds;
    }
    
    // Handle multiple dive masters
    let diveMasterIds: string[] = [];
    if (formData.selectedDiveMasterIds && Array.isArray(formData.selectedDiveMasterIds)) {
        diveMasterIds = formData.selectedDiveMasterIds;
    }
    
    // For backward compatibility, join multiple instructor IDs with comma
    const instructorString = instructorIds.length > 0 ? instructorIds.join(',') : instructor;
    
    // For backward compatibility, join multiple dive master IDs with comma
    const diveMasterString = diveMasterIds.length > 0 ? diveMasterIds.join(',') : formData.diveMaster;

    // --- Handle participants like in createDiveTrip ---
    let participants: {
        name: string;
        certification: string;
        level: string;
        customerId?: string;
    }[] = [];
    try {
        if (formData.participants && Array.isArray(formData.participants)) {
            participants = formData.participants.map((participant: any) => ({
                name: participant.name,
                certification: participant.certification,
                level: participant.level,
                customerId: participant?.customerId || undefined
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
            diveMaster: diveMasterString,
            instructor: instructorString,
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
                    diveMaster: diveMasterString,
                    description: formData.description,
                    duration: formData.duration,
                    difficulty: formData.difficulty,
                    center,
                    instructor: instructorString,
                    fleetVehicleId,
                    diveType,
                    expenses: formData.expenses ?? {},
                },
            },
        );

        // --- Update instructor assignments ---
        console.log('Deleting existing instructor assignments for trip:', id);
        await prisma.tripInstructorAssignment.deleteMany({ where: { tripId: id } });
        
        // Re-create instructor assignments if any
        if (instructorIds.length > 0) {
            console.log('Creating new instructor assignments:', instructorIds);
            await prisma.tripInstructorAssignment.createMany({
                data: instructorIds.map(staffId => ({ tripId: id, staffId })),
            });
        }

        // --- Update dive master assignments ---
        console.log('Deleting existing dive master assignments for trip:', id);
        await prisma.tripDiveMasterAssignment.deleteMany({ where: { tripId: id } });
        
        // Re-create dive master assignments if any
        if (diveMasterIds.length > 0) {
            console.log('Creating new dive master assignments:', diveMasterIds);
            await prisma.tripDiveMasterAssignment.createMany({
                data: diveMasterIds.map(staffId => ({ tripId: id, staffId })),
            });
        }

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
        
        // Delete instructor assignments linked to this dive trip
        await prisma.tripInstructorAssignment.deleteMany({
            where: { tripId: id },
        })
        
        // Delete dive master assignments linked to this dive trip
        await prisma.tripDiveMasterAssignment.deleteMany({
            where: { tripId: id },
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