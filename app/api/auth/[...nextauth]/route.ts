// app/api/auth/[...nextauth]/route.ts
import NextAuth, { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/prisma/prisma"
import { Role } from "@/app/generated/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession["user"]
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
