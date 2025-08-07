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
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      // Check subscription status for users with manager role
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (dbUser?.role === 'manager') {
          // Check if user has an active subscription
          const subscription = await prisma.userSubscription.findFirst({
            where: {
              customer_email: user.email,
              status: {
                in: ["paid", "free", "active"]
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          });

          if (!subscription) {
            // No subscription found for manager
            console.log(`No subscription found for manager: ${user.email}`);
            return `/signin/error?error=NoSubscription`;
          }

          // For free subscriptions, don't check expiration
          if (subscription.status === "free") {
            console.log(`Free subscription found for manager: ${user.email}`);
            return true;
          }

          // Check if subscription is expired (only for paid subscriptions)
          const currentTime = Date.now();
          const periodEnd = Number(subscription.period_end) * 1000;

          if (currentTime > periodEnd) {
            // Subscription expired, set role to null and prevent sign in
            console.log(`Subscription expired for manager: ${user.email}`);
            await prisma.user.update({
              where: { email: user.email },
              data: { role: null }
            });
            return `/signin/error?error=SubscriptionExpired`;
          }
        }
      }
      return true;
    },
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
