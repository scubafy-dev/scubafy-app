import prisma from "@prisma/prisma";
import type { CertificationLevel } from "@/app/generated/prisma";

export async function createCustomer(formData: FormData) {
  "use server";

  // 1) required defaults
  const requiredDefaults: Record<string,string> = {
    fullName:           "Unnamed Customer",
    email:              "no-email@example.com",
    phoneNumber:        "",
    certificationLevel: "openWater",
  };
  for (const [key, def] of Object.entries(requiredDefaults)) {
    if (!formData.get(key)) formData.append(key, def);
  }

  // 2) optional defaults
  const optionalDefaults: Record<string,string> = {
    roomNumber:     "",
    numberOfNights: "0",
    roomCost:       "0",
  };
  for (const [key, def] of Object.entries(optionalDefaults)) {
    if (!formData.get(key)) formData.append(key, def);
  }

  // 3) extract & cast
  const fullName           = formData.get("fullName")           as string;
  const email              = formData.get("email")              as string;
  const phoneNumber        = formData.get("phoneNumber")        as string;
  const certificationLevel = formData.get("certificationLevel") as CertificationLevel;
  const roomNumber         = (formData.get("roomNumber") as string) || null;
  const numberOfNights     = Number(formData.get("numberOfNights"));
  const roomCost           = Number(formData.get("roomCost"));

  // 4) create
  await prisma.customer.create({
    data: {
      fullName,
      email,
      phoneNumber,
      certificationLevel,
      roomNumber,
      numberOfNights,
      roomCost,
    },
  });
}

export async function updateCustomer(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  if (!id) throw new Error("Missing customer id");

  // build up the data object only with present fields
  const data: Record<string, any> = {};
  if (formData.get("fullName"))           data.fullName           = formData.get("fullName");
  if (formData.get("email"))              data.email              = formData.get("email");
  if (formData.get("phoneNumber"))        data.phoneNumber        = formData.get("phoneNumber");
  if (formData.get("certificationLevel")) data.certificationLevel = formData.get("certificationLevel");
  if (formData.get("roomNumber"))         data.roomNumber         = formData.get("roomNumber");
  if (formData.get("numberOfNights"))     data.numberOfNights     = Number(formData.get("numberOfNights"));
  if (formData.get("roomCost"))           data.roomCost           = Number(formData.get("roomCost"));

  await prisma.customer.update({
    where: { id },
    data,
  });
}

export async function deleteCustomer(id: string) {
  "use server";
  await prisma.customer.delete({
    where: { id },
  });
}

export async function getCustomerById(id: string) {
  "use server";
  return await prisma.customer.findUnique({
    where: { id },
  });
}

export async function getAllCustomers() {
  "use server";
  return await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
}
