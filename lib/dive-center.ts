"use server";

import prisma from "@/prisma/prisma";
import { useAuth } from "./use-auth";


export async function createDiveCenter(formData: FormData) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const email = formData.get("email") as string;
  const contact = formData.get("contact") as string;
  const session = await useAuth("/");

  console.log("Creating dive center with data:", {
    name,
    location,
    email,
    contact,
    session,
  });


  if (!name || !session?.user?.id) {
    throw new Error("All fields are required");
  }

  // Assuming you have a database client set up
  try {
        const diveCenter = await prisma.diveCenter.create({
            data: {
                name,
                location: location || null,
                email: email || null,
                contact: contact || null,
                owner: {
                    connect: { id: session.user.id }, // Connect the dive center to the user
                },
            },
        });
        return diveCenter;
    } catch (error) {
        console.error("Error creating dive center:", error);
        throw new Error("Failed to create dive center");
    }
}

export async function getAllDiveCenters(){
    const session = await useAuth("/");
    
    if (!session?.user?.id) {
        throw new Error("User not authenticated");
    }
    
    try {
        let diveCenters = await prisma.diveCenter.findMany({
            where: { ownerId: session.user.id },
        });
    
        // If no dive centers exist, create a default one
        if (!diveCenters || diveCenters.length === 0) {
            console.log("No dive centers found, creating default dive center");
            const defaultDiveCenter = await prisma.diveCenter.create({
                data: {
                    name: "My Dive Center",
                    location: "Default Location",
                    email: "info@mydivecenter.com",
                    contact: "+1 (555) 123-4567",
                    owner: {
                        connect: { id: session.user.id },
                    },
                },
            });
            diveCenters = [defaultDiveCenter];
            console.log("Created default dive center:", defaultDiveCenter);
        }
    
        return diveCenters;
    } catch (error) {
        console.error("Error fetching dive center:", error);
        throw new Error("Failed to fetch dive center");
    }
}

export const getIndividualDiveCenters = async (centerId: string) => {
    const session = await useAuth("/");
    
    if (!session?.user?.id) {
        throw new Error("User not authenticated");
    }
    
    if (!centerId) {
        throw new Error("Dive center ID is required");
    }
    
    try {
        const diveCenter = await prisma.diveCenter.findFirst({
            where: { 
                id: centerId,
                ownerId: session.user.id 
            },
        });
        
        if (!diveCenter) {
            throw new Error("Dive center not found");
        }
        
        return diveCenter;
    } catch (error) {
        console.error("Error fetching individual dive center:", error);
        throw new Error("Failed to fetch dive center");
    }
}

export const updateDiveCenter = async (centerId: string, formData: FormData) => {
    const session = await useAuth("/");
    
    if (!session?.user?.id) {
        throw new Error("User not authenticated");
    }
    
    if (!centerId) {
        throw new Error("Dive center ID is required");
    }
    
    try {
        const name = formData.get("name") as string;
        const location = formData.get("location") as string;
        const email = formData.get("email") as string;
        const contact = formData.get("contact") as string;
        
        console.log("Updating dive center with data:", {
            centerId,
            name,
            location,
            email,
            contact,
            userId: session.user.id
        });
        
        if (!name) {
            throw new Error("Dive center name is required");
        }
        
        // First, check if the dive center exists and belongs to the user
        const existingDiveCenter = await prisma.diveCenter.findFirst({
            where: { 
                id: centerId,
                ownerId: session.user.id 
            },
        });
        
        if (!existingDiveCenter) {
            console.error("Dive center not found or doesn't belong to user:", {
                centerId,
                userId: session.user.id
            });
            throw new Error("Dive center not found or access denied");
        }
        
        console.log("Found existing dive center:", existingDiveCenter);
        
        const updatedDiveCenter = await prisma.diveCenter.update({
            where: { 
                id: centerId
            },
            data: {
                name,
                location: location || null,
                email: email || null,
                contact: contact || null,
            },
        });
        
        console.log("Successfully updated dive center:", updatedDiveCenter);
        return updatedDiveCenter;
    } catch (error) {
        console.error("Error updating dive center:", error);
        
        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.message.includes("Record to update not found")) {
                throw new Error("Dive center not found");
            } else if (error.message.includes("Dive center not found or access denied")) {
                throw new Error("Dive center not found or access denied");
            } else if (error.message.includes("Dive center name is required")) {
                throw new Error("Dive center name is required");
            }
        }
        
        throw new Error("Failed to update dive center");
    }
}

export const deleteDiveCenter = async (centerId: string) => {
    const session = await useAuth("/");
    if (!session?.user?.id) {
        throw new Error("User not authenticated");
    }
    if (!centerId) {
        throw new Error("Dive center ID is required");
    }
    try {
        // Check if the dive center exists and belongs to the user
        const existingDiveCenter = await prisma.diveCenter.findFirst({
            where: {
                id: centerId,
                ownerId: session.user.id,
            },
        });
        if (!existingDiveCenter) {
            throw new Error("Dive center not found or access denied");
        }
        // Delete the dive center
        await prisma.diveCenter.delete({
            where: { id: centerId },
        });
        // Return the updated list of dive centers
        const diveCenters = await prisma.diveCenter.findMany({
            where: { ownerId: session.user.id },
        });
        return diveCenters;
    } catch (error) {
        console.error("Error deleting dive center:", error);
        throw new Error("Failed to delete dive center");
    }
};