// pages/api/check-role.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/prisma";  // Assuming prisma is set up

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: String(email) },
      });

      if (!user) {
        return res.status(404).json({ message: "Staff not found" });
      }

      return res.status(200).json({
        role: user.role,
        // permissions: staff.permissions,  // You can also return permissions if needed
      });
    } catch (error) {
      return res.status(500).json({ message: "Error checking role" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
