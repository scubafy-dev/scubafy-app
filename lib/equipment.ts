"use server";

import prisma  from '@prisma/prisma';
import { redirect } from 'next/navigation';
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

export async function createEquipment(formData: EquipmentFormType) {
  // 1) Ensure all required fields have *something*
  const requiredDefaults: Record<string,string> = {
    type: EquipmentType.BCD,
    brand: "Generic",
    model: "Model X",
    serialNumber: "SN-0000-0000",
  };
  // 2) Set up defaults for all the optional bits
  const optionalDefaults: Record<string,string> = {
    purchaseDate: new Date().toISOString(),
    lastInspection:  new Date().toISOString(),
    nextService:  new Date().toISOString(),
    usageCount:   "0",
    usageLimit:   "100",
    status:       EquipmentStatus.available,
    condition:    Condition.excellent,
    notes:        "",
  };

  // 3) Pull everything out, casting to the right types
  const type         = formData.type         as EquipmentType;
  const brand        = requiredDefaults.brand        as string;
  const modelName    = formData.model        as string;
  const serialNumber = formData.serialNumber as string;

  const purchaseDate = new Date();
  const lastService  = new Date(formData.lastInspection  as string);
  const nextService  = new Date(formData.nextInspection  as string);

  const usageCount   = formData.usageCount ? parseInt(formData.usageCount as string, 10) : null;
  const usageLimit   = formData.usageLimit ? parseInt(formData.usageLimit as string, 10) : null;

  const status       = optionalDefaults.status    as EquipmentStatus;
  const condition    = formData.condition as Condition;
  const notes        = optionalDefaults.notes     as string;

  // 4) Create it in the database
  try {
    await prisma.equipment.create({
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
  } catch (err) {
    console.error("Could not create equipment:", err);
  }

  // if you want to redirect:
  // redirect("/equipment");
}



export const  getAllEquipments = async () => {
  return prisma.equipment.findMany();
}

export async function updateEquipment(id: string | null, formData: EquipmentFormType) {
    if(id === null){
        return;
    }

    const type         = formData.type         as EquipmentType;
    const brand        = "Generic";
    const modelName    = formData.model        as string;
    const serialNumber = formData.serialNumber as string;
  
    const purchaseDate = new Date();
    const lastService  = new Date(formData.lastInspection  as string);
    const nextService  = new Date(formData.nextInspection  as string);
  
    const usageCount   = formData.usageCount ? parseInt(formData.usageCount as string, 10) : null;
    const usageLimit   = formData.usageLimit ? parseInt(formData.usageLimit as string, 10) : null;
  
    const status       = formData.status    as EquipmentStatus;
    const condition    = formData.condition as Condition;
    const notes        = formData.notes     as string;


    try {
        await prisma.equipment.update(
            {
                where: {
                    id
                },
                data: {
                    type,
                    brand,
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
            },
        );
    } catch (error) {
        console.log("error: ", error);
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

export const rentEquipment = async (id: string, rentedTo: string, price?: string, from?: string, to?: string) => {

  const rentPrice = price ? parseFloat(price) : null;
  const rentFrom  = from ? new Date(from) : null;
  const rentTo  = to ? new Date(to) : null;

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