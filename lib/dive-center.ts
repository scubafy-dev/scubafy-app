"use server";

import prisma from "@/prisma/prisma";
import { useAuth } from "./use-auth";


export async function createDiveCenter(formData: FormData) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const { user } = await useAuth("/");

  console.log("Creating dive center with data:", {
    name,
    location,
    user,
  });


  if (!name || !user) {
    throw new Error("All fields are required");
  }

  // Assuming you have a database client set up
  try{
        const diveCenter = await prisma.diveCenter.create({
            data: {
                name,
                location,
                    owner: {
                        connect: { id: user.id }, // Connect the dive center to the user
                    },
                }
            },
        );
        return diveCenter;
    }
    catch (error) {
        console.error("Error creating dive center:", error);
        throw new Error("Failed to create dive center");
    }
}

export async function getAllDiveCenters(){
    const { user } = await useAuth("/");
    
    if (!user) {
        throw new Error("User not authenticated");
    }
    
    try {
        const diveCenters = await prisma.diveCenter.findMany({
            where: { ownerId: user.id },
        });
    
        // if (!diveCenters || diveCenters.length === 0) {
        //     throw new Error("Dive center not found for this user");
        // }
    
        return diveCenters;
    } catch (error) {
        console.error("Error fetching dive center:", error);
        throw new Error("Failed to fetch dive center");
    }
}