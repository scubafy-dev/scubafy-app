"use server";

import prisma from "@/prisma/prisma";
import { useAuth } from "./use-auth";

export interface VehicleFormData {
  name: string;
  type: "boat" | "speedboat" | "liveaboard" | "car";
  size: string;
  capacity: number;
  description?: string;
  registrationNumber?: string;
  insuranceInfo?: string;
  imageUrl?: string;
  crewAssignments: Array<{
    staffId: string;
    role?: string;
  }>;
}

export interface FleetVehicle {
  id: string;
  name: string;
  type: "boat" | "speedboat" | "liveaboard" | "car";
  size: string;
  capacity: number;
  description?: string;
  registrationNumber?: string;
  insuranceInfo?: string;
  imageUrl?: string;
  crewAssignments: Array<{
    id: string;
    staffId: string;
    role?: string;
    staff: {
      id: string;
      fullName: string;
      roleTitle?: string;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export async function createFleetVehicle(formData: VehicleFormData, diveCenterId: string): Promise<FleetVehicle> {
  console.log('diveCenterId',diveCenterId)
  const session = await useAuth("/");
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    console.log("Creating fleet vehicle with data:", formData);
    
    // Use any type for now until Prisma client is regenerated
    const vehicle = await (prisma as any).fleetVehicle.create({
      data: {
        name: formData.name,
        type: formData.type,
        size: formData.size,
        capacity: formData.capacity,
        description: formData.description,
        registrationNumber: formData.registrationNumber,
        insuranceInfo: formData.insuranceInfo,
        imageUrl: formData.imageUrl,
        diveCenter: {
          connect: { id: diveCenterId }
        },
        crewAssignments: {
          create: formData.crewAssignments.map(assignment => ({
            staffId: assignment.staffId,
            role: assignment.role
          }))
        }
      },
      include: {
        crewAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                fullName: true,
                roleTitle: true
              }
            }
          }
        }
      }
    });

    console.log("Fleet vehicle created successfully:", vehicle);
    return vehicle as FleetVehicle;
  } catch (error) {
    console.error("Error creating fleet vehicle:", error);
    throw new Error("Failed to create fleet vehicle");
  }
}

export async function updateFleetVehicle(id: string, formData: VehicleFormData): Promise<FleetVehicle> {
  const session = await useAuth("/");
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    console.log("Updating fleet vehicle with data:", formData);
    
    // First, delete existing crew assignments
    await (prisma as any).vehicleCrewAssignment.deleteMany({
      where: { vehicleId: id }
    });

    const vehicle = await (prisma as any).fleetVehicle.update({
      where: { id },
      data: {
        name: formData.name,
        type: formData.type,
        size: formData.size,
        capacity: formData.capacity,
        description: formData.description,
        registrationNumber: formData.registrationNumber,
        insuranceInfo: formData.insuranceInfo,
        imageUrl: formData.imageUrl,
        crewAssignments: {
          create: formData.crewAssignments.map(assignment => ({
            staffId: assignment.staffId,
            role: assignment.role
          }))
        }
      },
      include: {
        crewAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                fullName: true,
                roleTitle: true
              }
            }
          }
        }
      }
    });

    console.log("Fleet vehicle updated successfully:", vehicle);
    return vehicle as FleetVehicle;
  } catch (error) {
    console.error("Error updating fleet vehicle:", error);
    throw new Error("Failed to update fleet vehicle");
  }
}

export async function deleteFleetVehicle(id: string): Promise<void> {
  const session = await useAuth("/");
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    await (prisma as any).fleetVehicle.delete({
      where: { id }
    });
    console.log("Fleet vehicle deleted successfully:", id);
  } catch (error) {
    console.error("Error deleting fleet vehicle:", error);
    throw new Error("Failed to delete fleet vehicle");
  }
}

export async function getAllFleetVehicles(diveCenterId: string): Promise<FleetVehicle[]> {
  const session = await useAuth("/");
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const vehicles = await (prisma as any).fleetVehicle.findMany({
      where: { diveCenterId },
      include: {
        crewAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                fullName: true,
                roleTitle: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return vehicles as FleetVehicle[];
  } catch (error) {
    console.error("Error fetching fleet vehicles:", error);
    throw new Error("Failed to fetch fleet vehicles");
  }
}

export async function getFleetVehicleById(id: string): Promise<FleetVehicle | null> {
  const session = await useAuth("/");
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const vehicle = await (prisma as any).fleetVehicle.findUnique({
      where: { id },
      include: {
        crewAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                fullName: true,
                roleTitle: true
              }
            }
          }
        }
      }
    });

    return vehicle as FleetVehicle | null;
  } catch (error) {
    console.error("Error fetching fleet vehicle:", error);
    throw new Error("Failed to fetch fleet vehicle");
  }
} 