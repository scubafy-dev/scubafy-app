import prisma  from '@prisma/prisma';
import { redirect } from 'next/navigation';
import {
  EquipmentType,
  EquipmentStatus,
  Condition,
} from "@/app/generated/prisma";

export type Equipment = {
    type: string;
    sku: string;
    make: string;
    model: string;
    serialNumber: string;
    size: string;
    location: string;
    condition: string;
    quantity: string;
    trackMinQuantity: boolean;
    trackUsage: boolean;
    lastInspection: string,
    nextInspection: string,
    itemValue: string,
    rentalRate: string,    
    rentalTimeframe: string;
}

export async function createEquipment(formData: Equipment) {
  "use server";

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
    lastService:  new Date().toISOString(),
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

  const usageCount   = 0;
  const usageLimit   = 100;

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

export async function updateDiveTrip(id: string | null, formData: FormData) {
    "use server";

    if(id === null){
        return;
    }

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const capacity = Number(formData.get("capacity"));
    const booked = Number(formData.get("booked"));
    const price = Number(formData.get("price"));
    const status = formData.get("status") as
        | "upcoming"
        | "in_progress"
        | "completed"
        | "cancelled";
    const diveMaster = formData.get("diveMaster") as string;
    const description = formData.get("description") as string;
    const duration = formData.get("duration") as string;
    const difficulty = formData.get("difficulty") as
        | "beginner"
        | "intermediate"
        | "advanced";
    const center = (formData.get("center") as string) || null;
    const instructor = formData.get("instructor") as string;


    try {
        await prisma.diveTrip.update(
            {
                where: {
                    id
                },
                data: {
                    title,
                    // date,
                    location,
                    capacity,
                    booked,
                    price,
                    status,
                    diveMaster,
                    description,
                    // duration,
                    // difficulty,
                    center,
                    instructor,
                },
            },
        );
    } catch (error) {
        console.log("error: ", error);
    }

    // redirect("/diveTrips");
}

export const deleteDiveTrip = async (id: string) => {
    "use server"
      
    try{
        // Delete participants linked to this dive trip
        await prisma.participant.deleteMany({
            where: { diveTripId: id },
            })
        
        // Delete vehicle linked to this dive trip
        await prisma.vehicle.deleteMany({
        where: { diveTripId: id },
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