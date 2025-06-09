"use server";

import prisma from "@/prisma/prisma";
import { Role } from "@/app/generated/prisma";

export const updateUserRole = async (email: string, newRole: Role ): Promise<void> => {
  try {
    await prisma.user.update({
      where: { email },
      data: { role: newRole },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
}

export const getUserRole = async (email: string): Promise<Role | null> => {
    try {
        const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true },
        });
    
        return user?.role || null;
    } catch (error) {
        console.error("Error checking user role:", error);
        throw new Error("Failed to check user role");
    }
}

export const getStaffRole = async (email: string): Promise<string | null> => {
    try {
        const staff = await prisma.staff.findUnique({
            where: { email },
            select: { roleTitle: true },
        });

        return staff?.roleTitle || null;
    } catch (error) {
        console.error("Error checking staff role:", error);
        return null;
        //throw new Error("Failed to check staff role");
    }
}