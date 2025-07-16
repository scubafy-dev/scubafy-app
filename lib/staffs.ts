// lib/staff.ts
"use server"
import prisma from "@/prisma/prisma";
import { Gender, StaffStatus, Permission } from "@app/generated/prisma";

export interface StaffWithPermissions {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  age: number | null;
  gender: Gender | null;
  roleTitle: string | null;
  salary: number | null;
  status: StaffStatus;
  address: string | null;
  emergencyContact: string | null;
  bio: string | null;
  staffCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  permissions: Permission[];
}


export async function createStaff(formData: FormData, diveCenterId: string) {
  // 1) ensure required fields
  console.log('formData server',formData)
  const requiredDefaults: Record<string, string> = {
    fullName: "Unnamed Staff",
    email: "no-email@example.com",
    phoneNumber: "",
  };
  for (const [key, def] of Object.entries(requiredDefaults)) {
    if (!formData.get(key)) formData.append(key, def);
  }

  // 2) default status if missing
  if (!formData.get("status")) {
    formData.append("status", StaffStatus.active);
  }

  // 3) extract & cast
  const fullName = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phone") as string;

  const ageStr = formData.get("age") as string | null;
  const age = ageStr ? Number(ageStr) : null;

  const genderValue = formData.get("gender") as Gender | null;
  const gender = genderValue && Object.values(Gender).includes(genderValue)
    ? (genderValue as Gender)
    : null;

  const roleTitle = (formData.get("role") as string) || null;
  const status = formData.get("status") as StaffStatus;

  const salaryStr = formData.get("salary") as string | null;
  const salary = salaryStr ? Number(salaryStr) : null;

  const address = (formData.get("address") as string) || null;
  const emergencyContact = (formData.get("emergencyContact") as string) || null;
  const bio = (formData.get("bio") as string) || null;

  // collect all checked permissions (may be zero)
  const permissions = formData.getAll("access") as string[];
  const perms = permissions
    .filter((p) => Object.values(Permission).includes(p as Permission))
    .map((p) => ({ permission: p as Permission }));

  console.log("Creating staff with permissions: ", perms);
  console.log("Creating staff with email: ", email);

  // Add this:
  if (!diveCenterId) {
    throw new Error("Missing dive center ID");
  }

  // Generate unique staff code
  const generateStaffCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  let staffCode;
  let isUnique = false;
  while (!isUnique) {
    staffCode = generateStaffCode();
    const existingStaff = await prisma.staff.findUnique({
      where: { staffCode },
    });
    if (!existingStaff) {
      isUnique = true;
    }
  }

  // 4) create in DB
  const created = await prisma.staff.create({
    data: {
      fullName,
      email,
      phoneNumber,
      age,
      gender,
      roleTitle,
      status,
      salary,
      address,
      emergencyContact,
      bio,
      diveCenterId,
      staffCode,
      permissions: {
        create: perms,
      },
    },
  });

  return { success: true, data: created, staffCode }; 
}

export async function updateStaff(id: string, formData: FormData) {
  console.log('formData server',formData)
  if (!id) throw new Error("Missing staff id");

  // build up scalar fields
  const data: Record<string, any> = {};
  if (formData.get("name")) data.fullName = formData.get("name");
  if (formData.get("email")) data.email = formData.get("email");
  if (formData.get("phone")) data.phoneNumber = formData.get("phone");

  if (formData.get("age") !== null) {
    const ageStr = formData.get("age") as string;
    data.age = ageStr ? Number(ageStr) : null;
  }

  if (formData.get("salary") !== null) {
    const salaryStr = formData.get("salary") as string;
    data.salary = salaryStr ? Number(salaryStr) : null;
  }

  if (formData.get("gender")) {
    const g = formData.get("gender") as Gender;
    if (Object.values(Gender).includes(g)) data.gender = g;
  }

  if (formData.get("role")) data.roleTitle = formData.get("role");
  if (formData.get("status")) data.status = formData.get("status");
  if (formData.get("address")) data.address = formData.get("address");
  if (formData.get("emergencyContact")) data.emergencyContact = formData.get("emergencyContact");
  if (formData.get("bio")) data.bio = formData.get("bio");

  // handle permissions if they're present
  let permsUpdate = undefined;
  if (formData.getAll("access").length) {
    const permissions = formData.getAll("access") as string[];
    const perms = permissions
      .filter((p) => Object.values(Permission).includes(p as Permission))
      .map((p) => ({ permission: p as Permission }));
    permsUpdate = {
      deleteMany: {},
      create: perms,
    };
  }

  await prisma.staff.update({
    where: { id },
    data: {
      ...data,
      ...(permsUpdate && { permissions: permsUpdate }),
    },
  });
}

export async function deleteStaff(id: string) {
  await prisma.staff.delete({
    where: { id },
  });
}

export async function getStaffById(id: string) {
  return prisma.staff.findUnique({
    where: { id },
    include: {
      permissions: { select: { permission: true } },
    },
  });
}

export async function getAllStaff(diveCenterId?: string) {
  "use server";
  if(!diveCenterId){
    throw new Error("Missing dive center ID");
  }
  const whereClause = diveCenterId ? { diveCenterId } : {};

  const rows = await prisma.staff.findMany({
    orderBy: { fullName: "asc" },
    where: whereClause,
    include: {
      permissions: { select: { permission: true } },
    },
  });

  return rows.map(({ permissions, ...staff }) => ({
    ...staff,
    permissions: permissions.map((p) => p.permission),
  }))
}

// export async function getAllStaff() {
//   const rows = await prisma.staff.findMany({
//     orderBy: { fullName: "asc" },
//     include: {
//       permissions: { select: { permission: true } },
//     },
//   });

//   return rows.map(({ permissions, ...staff }) => ({
//     ...staff,
//     permissions: permissions.map((p) => p.permission),
//   }))
// }

export async function verifyStaffCode(staffCode: string, userEmail: string) {
  try {
    console.log("verifyStaffCode called with:", { staffCode, userEmail });

    const staff = await prisma.staff.findFirst({
      where: {
        staffCode,
        email: userEmail,
        status: StaffStatus.active,
      },
      include: {
        permissions: { select: { permission: true } },
        diveCenter: { select: { id: true, name: true } },
      },
    });

    console.log("Found staff:", staff ? {
      id: staff.id,
      fullName: staff.fullName,
      email: staff.email,
      staffCode: staff.staffCode,
      status: staff.status,
      diveCenterId: staff.diveCenterId,
      diveCenterName: staff.diveCenter?.name,
    } : null);

    if (!staff) {
      console.log("Staff not found or not active");
      return { success: false, message: "Invalid staff code or staff not found" };
    }

    if (!staff.diveCenter) {
      console.log("Staff has no dive center assigned");
      return { success: false, message: "Staff is not assigned to any dive center" };
    }

    return {
      success: true,
      staff: {
        ...staff,
        permissions: staff.permissions.map((p) => p.permission),
      },
      diveCenter: staff.diveCenter,
    };
  } catch (error) {
    console.error("Error verifying staff code:", error);
    return { success: false, message: "Error verifying staff code" };
  }
}

export async function getStaffByCode(staffCode: string) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { staffCode },
      include: {
        permissions: { select: { permission: true } },
        diveCenter: { select: { id: true, name: true } },
      },
    });

    if (!staff) {
      return null;
    }

    return {
      ...staff,
      permissions: staff.permissions.map((p) => p.permission),
    };
  } catch (error) {
    console.error("Error getting staff by code:", error);
    return null;
  }
}

export async function getDiveCenterByStaffCode(staffCode: string) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { staffCode },
      include: {
        diveCenter: true, // Include full dive center details
      },
    });

    if (!staff) {
      return { success: false, message: "Staff not found" };
    }

    if (!staff.diveCenter) {
      return { success: false, message: "Staff is not assigned to any dive center" };
    }

    return {
      success: true,
      diveCenter: staff.diveCenter,
      staff: {
        id: staff.id,
        fullName: staff.fullName,
        email: staff.email,
        staffCode: staff.staffCode,
        status: staff.status,
      },
    };
  } catch (error) {
    console.error("Error getting dive center by staff code:", error);
    return { success: false, message: "Error retrieving dive center details" };
  }
}
