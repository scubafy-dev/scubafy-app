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
    type: EquipmentType;
    brand: string;
    model: string;
    serialNumber: string;
    purchaseDate: string;
    lastInspection: string,
    nextInspection: string,
    status: EquipmentStatus,
    condition: Condition,
    usageCount: string | null;
    usageLimit: string | null;    
    notes: string;
}

export type Equipment = {
  id: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: Date | null;
  lastService: Date | null,
  nextService: Date | null,
  status: EquipmentStatus,
  condition: Condition,
  usageCount: number | null;
  usageLimit: number | null;    
  notes: string | null;
}

// Helper function to map string equipment types to enum values
function mapEquipmentType(typeString: string): EquipmentType {
  const typeMap: Record<string, EquipmentType> = {
    'Scuba Tank': EquipmentType.BCD, // Map to closest available type
    'BCD': EquipmentType.BCD,
    'Regulator': EquipmentType.Regulator,
    'Wetsuit': EquipmentType.Wetsuit,
    'Dive Computer': EquipmentType.DiveComputer,
    'DiveComputer': EquipmentType.DiveComputer,
    'Fins': EquipmentType.Fins,
    'Tank': EquipmentType.BCD, // Map tank to BCD as closest
    'Cylinder': EquipmentType.BCD, // Map cylinder to BCD as closest
  };
  
  // If the string is already a valid enum value, use it directly
  if (Object.values(EquipmentType).includes(typeString as EquipmentType)) {
    return typeString as EquipmentType;
  }
  
  return typeMap[typeString] || EquipmentType.BCD; // Default to BCD if not found
}

export async function createEquipment(formData: EquipmentFormType) {
  // 1) Ensure all required fields have *something*
  console.log('Equipments========>',formData)
  
  // 2) Pull everything out, casting to the right types
  const type         = mapEquipmentType(formData.type as string);
  const brand        = formData.brand        || "Generic";
  const modelName    = formData.model        || "Model X";
  const serialNumber = formData.serialNumber || "SN-0000-0000";

  const purchaseDate = formData.purchaseDate ? new Date(formData.purchaseDate) : new Date();
  const lastService  = formData.lastInspection ? new Date(formData.lastInspection) : new Date();
  const nextService  = formData.nextInspection ? new Date(formData.nextInspection) : new Date();

  const usageCount   = formData.usageCount ? parseInt(formData.usageCount as string, 10) : 0;
  const usageLimit   = formData.usageLimit ? parseInt(formData.usageLimit as string, 10) : 100;

  const status       = formData.status    || EquipmentStatus.available;
  const condition    = formData.condition || Condition.excellent;
  const notes        = formData.notes     || "";

  // 3) Create it in the database
  try {
    const created = await prisma.equipment.create({
      data: {
        type,
        brand,
        model: modelName,
        serialNumber,
        purchaseDate,
        lastService,
        nextService,
        usageCount,
        usageLimit,
        status,
        condition,
        notes,
      },
    });
    return { success: true, data: created };
  } catch (err) {
    console.error("Could not create equipment:", err);
    return { success: false, error: err };
  }
}

export const  getAllEquipments = async () => {
  return prisma.equipment.findMany();
}

export async function updateEquipment(id: string | null, formData: EquipmentFormType) {
    if(id === null){
        return { success: false, error: "No ID provided" };
    }

    const type         = mapEquipmentType(formData.type as string);
    const brand        = formData.brand        || "Generic";
    const modelName    = formData.model        || "Model X";
    const serialNumber = formData.serialNumber || "SN-0000-0000";
  
    const purchaseDate = formData.purchaseDate ? new Date(formData.purchaseDate) : new Date();
    const lastService  = formData.lastInspection ? new Date(formData.lastInspection) : new Date();
    const nextService  = formData.nextInspection ? new Date(formData.nextInspection) : new Date();
  
    const usageCount   = formData.usageCount ? parseInt(formData.usageCount as string, 10) : 0;
    const usageLimit   = formData.usageLimit ? parseInt(formData.usageLimit as string, 10) : 100;
  
    const status       = formData.status    || EquipmentStatus.available;
    const condition    = formData.condition || Condition.excellent;
    const notes        = formData.notes     || "";

    try {
        const updated = await prisma.equipment.update({
            where: { id },
            data: {
                type,
                brand,
                model: modelName,
                serialNumber,
                purchaseDate,
                lastService,
                nextService,
                usageCount,
                usageLimit,
                status,
                condition,
                notes,
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

export const rentEquipment = async (id: string, rentedTo: string, price: string | null, from: string | null, to: string | null) => {

  const rentPrice = price ? parseFloat(price) : null;
  // check if invalid date
  const rentFrom  = from ? new Date(from) : null;
  const rentTo  = to ? new Date(to) : null;
  if (!id || !rentedTo) {
    throw new Error("Missing required parameters: id and rentedTo");
  }
    try {
        await prisma.equipment.update({
            where: { id },
            data: {
                status: EquipmentStatus.rented,
                rentedToId: rentedTo,
                rentPrice,
                rentFrom,
                rentTo,
            },
        });

    } catch (error) {
        console.error("Error renting equipment:", error);
        throw new Error("Failed to rent equipment");
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