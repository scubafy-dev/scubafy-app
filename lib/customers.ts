"use server";
import prisma from "@prisma/prisma";
import type { CertificationLevel } from "@/app/generated/prisma";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  certificationLevel: CertificationLevel | null;
  roomNumber: string | null;
  numberOfNights: number | null;
  roomCost: number | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  Equipment?: Array<{
    id: string;
    type: string;
    brand: string;
    model: string;
    rentPrice: number | null;
    rentFrom: Date | null;
    rentTo: Date | null;
    condition: string;
  }>;
  participants?: Array<{
    id: string;
    name: string;
    certification: string;
    level: string;
    customerId?: string | null;
    diveTrip: {
      id: string;
      title: string;
      price: number | null;
      date: Date | null;
      location: string | null;
    };
  }>;
}


export async function createCustomer(formData: FormData, diveCenterId: string) {
  try {
    console.log('customer Data server', formData)
    // 1) required defaults
    const requiredDefaults: Record<string, string> = {
      fullName: "Unnamed Customer",
      email: "no-email@example.com",
      phoneNumber: "",
      certificationLevel: "openWater",
    };
    for (const [key, def] of Object.entries(requiredDefaults)) {
      if (!formData.get(key)) formData.append(key, def);
    }

    // 2) optional defaults
    const optionalDefaults: Record<string, string> = {
      roomNumber: "",
      numberOfNights: "0",
      roomCost: "0",
    };
    for (const [key, def] of Object.entries(optionalDefaults)) {
      if (!formData.get(key)) formData.append(key, def);
    }

    // 3) extract & cast
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const certificationLevel = formData.get("certificationLevel") as CertificationLevel;
    const roomNumber = formData.get("room") as string;
    const numberOfNights = Number(formData.get("numberOfNights"));
    const roomCost = Number(formData.get("roomCost"));

    // 4) create
    const created = await prisma.customer.create({
      data: {
        fullName,
        email,
        phoneNumber,
        certificationLevel,
        roomNumber,
        numberOfNights,
        roomCost,
        diveCenterId, // Connect to the dive center
      },
    });
    return { success: true, data: created };
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

// Server action for creating customers (can be used in client components)
export async function createCustomerAction(formData: FormData) {
  "use server";

  // Get dive center ID from the form data or context
  const diveCenterId = formData.get("diveCenterId") as string;

  if (!diveCenterId) {
    throw new Error("No dive center ID provided");
  }

  return createCustomer(formData, diveCenterId);
}

export async function updateCustomer(id: string, formData: FormData) {
  console.log('update customer server', formData)
  try {
    if (!id) throw new Error("Missing customer id");

    // build up the data object only with present fields
    const data: Record<string, any> = {};
    if (formData.get("fullName")) data.fullName = formData.get("fullName");
    if (formData.get("email")) data.email = formData.get("email");
    if (formData.get("phoneNumber")) data.phoneNumber = formData.get("phoneNumber");
    if (formData.get("certificationLevel")) data.certificationLevel = formData.get("certificationLevel");
    if (formData.get("room")) data.roomNumber = formData.get("room");
    if (formData.get("numberOfNights")) data.numberOfNights = Number(formData.get("numberOfNights"));
    if (formData.get("roomCost")) data.roomCost = Number(formData.get("roomCost"));

    await prisma.customer.update({
      where: { id },
      data,
    });
  }
  catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
}

export async function deleteCustomer(id: string) {
  try {
    if (!id) throw new Error("Missing customer id");
    // Check if the customer exists
    await prisma.customer.delete({
      where: { id },
    });
  }
  catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}

export async function getCustomerById(id: string) {
  "use server";
  return await prisma.customer.findUnique({
    where: { id },
    include: {
      Equipment: {
        where: {
          status: "rented"
        }
      },
      participants: {
        include: {
          diveTrip: true
        }
      }
    }
  });
}

export async function getAllCustomers(diveCenterId?: string) {
  "use server";
  const whereClause = diveCenterId ? { diveCenterId } : {};

  return await prisma.customer.findMany({
    where: whereClause,
    include: {
      Equipment: {
        where: {
          status: "rented"
        }
      },
      participants: {
        include: {
          diveTrip: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}
