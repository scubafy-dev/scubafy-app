"use server";

import prisma  from '@prisma/prisma';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import {
  EquipmentType,
  EquipmentStatus,
  Condition,
} from "@/app/generated/prisma";

export type EquipmentFormType = {
    type: string;
    sku: string | null;
    make: string | null;
    brand: string;
    model: string;
    serialNumber: string;
    size: string | null;
    location: string | null;
    purchaseDate: string;
    lastInspection: string,
    nextInspection: string,
    status: EquipmentStatus,
    condition: Condition,
    usageCount: string | null;
    usageLimit: string | null;    
    notes: string;
    // New fields
    quantity: string;
    minQuantity: string;
    itemValue: string | null;
    rentalRate: string | null;
    rentalTimeframe: string | null;
}

export type Equipment = {
  id: string;
  type: string;
  sku: string | null;
  make: string | null;
  brand: string;
  model: string;
  serialNumber: string;
  size: string | null;
  location: string | null;
  purchaseDate: Date | null;
  lastService: Date | null,
  nextService: Date | null,
  status: EquipmentStatus,
  condition: Condition,
  usageCount: number | null;
  usageLimit: number | null;    
  notes: string | null;
  // New fields
  quantity: number;
  minQuantity: number;
  availableQuantity: number;
  itemValue: number | null;
  rentalRate: number | null;
  rentalTimeframe: string | null;
}

export async function createEquipment(formData: EquipmentFormType, diveCenterId: string) {
  // 1) Ensure all required fields have *something*
  console.log('Equipments========>',formData)

  if (!diveCenterId) {
    throw new Error("Missing dive center ID");
  }
  
  // 2) Pull everything out, casting to the right types
  const type         = formData.type;
  const sku          = formData.sku || null;
  const make         = formData.make || null;
  const brand        = formData.brand        || "Generic";
  const modelName    = formData.model        || "Model X";
  const serialNumber = formData.serialNumber || "SN-0000-0000";
  const size         = formData.size || null;
  const location     = formData.location || null;

  const purchaseDate = formData.purchaseDate ? new Date(formData.purchaseDate) : new Date();
  const lastService  = formData.lastInspection ? new Date(formData.lastInspection) : new Date();
  const nextService  = formData.nextInspection ? new Date(formData.nextInspection) : new Date();

  const usageCount   = formData.usageCount ? parseInt(formData.usageCount as string, 10) : 0;
  const usageLimit   = formData.usageLimit ? parseInt(formData.usageLimit as string, 10) : 100;

  const status       = formData.status    || EquipmentStatus.available;
  const condition    = formData.condition || Condition.excellent;
  const notes        = formData.notes     || "";

  // New fields
  const quantity     = formData.quantity ? parseInt(formData.quantity, 10) : 1;
  const minQuantity  = formData.minQuantity ? parseInt(formData.minQuantity, 10) : 0;
  const itemValue    = formData.itemValue ? parseFloat(formData.itemValue) : null;
  const rentalRate   = formData.rentalRate ? parseFloat(formData.rentalRate) : null;
  const rentalTimeframe = formData.rentalTimeframe || null;

  // 3) Create it in the database
  try {
    const created = await prisma.equipment.create({
      data: {
        type,
        sku,
        make,
        brand,
        model: modelName,
        serialNumber,
        size,
        location,
        purchaseDate,
        lastService,
        nextService,
        usageCount,
        usageLimit,
        status,
        condition,
        notes,
        // New fields
        quantity,
        minQuantity,
        availableQuantity: quantity, // Initially available equals total quantity
        itemValue,
        rentalRate,
        rentalTimeframe,
        diveCenterId
      },
    });
    return { success: true, data: created };
  } catch (err) {
    console.error("Could not create equipment:", err);
    return { success: false, error: err };
  }
}

export const  getAllEquipments = async (diveCenterId?: string) => {
  const whereClause = diveCenterId ? { diveCenterId } : {};
  return prisma.equipment.findMany(
    {
      where: whereClause,
      include: {
        equipmentRentals: {
          where: {
            status: "active"
          },
          include: {
            customer: true
          }
        }
      }
    }
  );
}

export async function updateEquipment(id: string | null, formData: EquipmentFormType) {
    if(id === null){
        return { success: false, error: "No ID provided" };
    }

    const type         = formData.type;
    const sku          = formData.sku || null;
    const make         = formData.make || null;
    const brand        = formData.brand        || "Generic";
    const modelName    = formData.model        || "Model X";
    const serialNumber = formData.serialNumber || "SN-0000-0000";
    const size         = formData.size || null;
    const location     = formData.location || null;
  
    const purchaseDate = formData.purchaseDate ? new Date(formData.purchaseDate) : new Date();
    const lastService  = formData.lastInspection ? new Date(formData.lastInspection) : new Date();
    const nextService  = formData.nextInspection ? new Date(formData.nextInspection) : new Date();
  
    const usageCount   = formData.usageCount ? parseInt(formData.usageCount as string, 10) : 0;
    const usageLimit   = formData.usageLimit ? parseInt(formData.usageLimit as string, 10) : 100;
  
    const status       = formData.status    || EquipmentStatus.available;
    const condition    = formData.condition || Condition.excellent;
    const notes        = formData.notes     || "";

    // New fields
    const quantity     = formData.quantity ? parseInt(formData.quantity, 10) : 1;
    const minQuantity  = formData.minQuantity ? parseInt(formData.minQuantity, 10) : 0;
    const itemValue    = formData.itemValue ? parseFloat(formData.itemValue) : null;
    const rentalRate   = formData.rentalRate ? parseFloat(formData.rentalRate) : null;
    const rentalTimeframe = formData.rentalTimeframe || null;

    try {
        const updated = await prisma.equipment.update({
            where: { id },
            data: {
                type,
                sku,
                make,
                brand,
                model: modelName,
                serialNumber,
                size,
                location,
                purchaseDate,
                lastService,
                nextService,
                usageCount,
                usageLimit,
                status,
                condition,
                notes,
                // New fields
                quantity,
                minQuantity,
                itemValue,
                rentalRate,
                rentalTimeframe,
            },
        });
        return { success: true, data: updated };
    } catch (error) {
        console.error("Could not update equipment:", error);
        return { success: false, error: error };
    }
}

export const deleteEquipment = async (id: string) => {      
    try{
        const res = await prisma.equipment.delete({
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

export const rentEquipment = async (equipmentId: string, customerId: string, quantity: number, rentPrice: number, rentFrom: Date, rentTo: Date | null) => {
  if (!equipmentId || !customerId) {
    throw new Error("Missing required parameters: equipmentId and customerId");
  }

  try {
    // First, check if equipment has enough available quantity
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId }
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    if (equipment.availableQuantity < quantity) {
      throw new Error(`Not enough available quantity. Available: ${equipment.availableQuantity}, Requested: ${quantity}`);
    }

    // Create the rental record
    const rental = await prisma.equipmentRental.create({
      data: {
        equipmentId,
        customerId,
        quantity,
        rentPrice,
        rentFrom,
        rentTo,
        status: "active"
      }
    });

    // Update equipment available quantity
    await prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        availableQuantity: equipment.availableQuantity - quantity,
        status: equipment.availableQuantity - quantity === 0 ? EquipmentStatus.rented : EquipmentStatus.in_use
      }
    });

    return { success: true, data: rental };
  } catch (error) {
    console.error("Could not rent equipment:", error);
    throw error;
  }
}

export const returnEquipment = async (rentalId: string) => {
  try {
    // Get the rental record
    const rental = await prisma.equipmentRental.findUnique({
      where: { id: rentalId },
      include: { equipment: true }
    });

    if (!rental) {
      throw new Error("Rental record not found");
    }

    // Update rental status
    await prisma.equipmentRental.update({
      where: { id: rentalId },
      data: {
        status: "returned",
        returnedAt: new Date()
      }
    });

    // Update equipment available quantity
    await prisma.equipment.update({
      where: { id: rental.equipmentId },
      data: {
        availableQuantity: rental.equipment.availableQuantity + rental.quantity,
        status: rental.equipment.availableQuantity + rental.quantity === rental.equipment.quantity ? EquipmentStatus.available : EquipmentStatus.in_use
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Could not return equipment:", error);
    throw error;
  }
}

export const makeEquipmentAvailable = async (id: string) => {
  console.log("Making equipment available with ID:", id);
    try {
        await prisma.equipment.update({
            where: { id },
            data: {
                status: EquipmentStatus.available,
                rentedToId: null,
                rentPrice: null,
                rentFrom: null,
                rentTo: null,
            },
        });

    } catch (error) {
        console.error("Error availing equipment:", error);
        throw new Error("Failed to avail equipment");
    }
}

export async function getAvailableEquipment() {
  return prisma.equipment.findMany({
    where: { status: "available" },
  });
}

export async function getInUseEquipment() {
  return prisma.equipment.findMany({
    where: { status: "in_use" },
  });
}

export async function getRentedEquipment() {
  return prisma.equipment.findMany({
    where: { status: "rented" },
  });
}

export async function getMaintenanceEquipment() {
  return prisma.equipment.findMany({
    where: { status: "maintenance" },
  });
}