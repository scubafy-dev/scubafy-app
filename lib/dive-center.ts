"use server";

import prisma from "@/prisma/prisma";
import { useAuth } from "./use-auth";


export async function createDiveCenter(formData: FormData) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const session = await useAuth("/");

  console.log("Creating dive center with data:", {
    name,
    location,
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
                location,
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