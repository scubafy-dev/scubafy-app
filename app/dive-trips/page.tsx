// app/diveTrips/new/page.tsx
import prisma from "@/prisma/prisma";
import { redirect } from "next/navigation";
import DiveTripsPage from "./client";

export const dynamic = "force-dynamic";

export default function NewDiveTripPage() {
    // ❶ Server Action
    async function upsertDiveTrip(formData: FormData) {
        "use server";
        // Validate required form data fields
        // const requiredFields = [
        //   "title",
        //   "date",
        //   "location",
        //   "capacity",
        //   "price",
        //   "diveMaster",
        //   "instructor"
        // ];

        // for (const field of requiredFields) {
        //   if (!formData.get(field)) {
        //     throw new Error(`Missing required field: ${field}`);
        //   }
        // }

        // Set default values for required fields
        const requiredDefaults = {
            title: "Sample Dive Trip",
            date: new Date().toISOString(),
            location: "Blue Lagoon",
            capacity: 8,
            price: 120,
            diveMaster: "DM-001",
            instructor: "INS-001",
        };

        // For each required field, use the form value if present, otherwise use default
        for (const [key, defaultValue] of Object.entries(requiredDefaults)) {
            if (!formData.get(key)) {
                formData.append(key, defaultValue.toString());
            }
        }
        // Set default values for optional fields
        const defaultValues = {
            booked: 0,
            status: "upcoming",
            description: "",
            duration: "",
            difficulty: "beginner",
            center: null,
            vehicle: JSON.stringify({
                name: "Default Vehicle",
                type: "boat",
                capacity: 8,
            }),
            participants: JSON.stringify([]),
        };

        // For each optional field, use the form value if present, otherwise use default
        for (const [key, defaultValue] of Object.entries(defaultValues)) {
            if (!formData.get(key)) {
                formData.append(key, defaultValue);
            }
        }

        const id = formData.get("id") as string | null;
        const title = formData.get("title") as string;
        const dateStr = formData.get("date") as string;
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

        const vehicle = JSON.parse(
            formData.get("vehicle") as string,
        ) as {
            name: string;
            type: "boat" | "speedboat" | "catamaran";
            capacity: number;
        };
        // const participants = JSON.parse(
        //     formData.get("participants") as string,
        // ) as Array<{
        //     name: string;
        //     certification: string;
        //     level: string;
        // }>;

        const participants: {
            name: string;
            certification: string;
            level: string;
        }[] = [];
        try {
            await prisma.diveTrip.create(
                {
                    data: {
                        title,
                        date: new Date(dateStr),
                        location,
                        capacity,
                        booked,
                        price,
                        status,
                        diveMaster,
                        description,
                        duration,
                        difficulty,
                        center,
                        instructor,
                        vehicle: { create: vehicle },
                        participants: { createMany: { data: participants } },
                    },
                },
            );
        } catch (error) {
            console.log("error: ", error);
        }

        // redirect("/diveTrips");
    }

    return (
        <div>
            {/* ❷ Pass the action down to the client form */}
            <DiveTripsPage action={upsertDiveTrip} />
            {/* <DiveTripForm action={upsertDiveTrip} /> */}
        </div>
    );
}
