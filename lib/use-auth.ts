import { getServerSession } from "next-auth/next"
import { redirect }         from "next/navigation"
import { authOptions }      from "@/app/api/auth/[...nextauth]/route"

/**
 * Server-side “hook” to get your session and
 * redirect to signin if unauthenticated.
 *
 * @param callbackUrl where to go after signin (defaults to current page)
 */
export async function useAuth(callbackUrl: string = "") {
  const session = await getServerSession(authOptions)
  if (!session) {
    // if no callbackUrl was passed, NextAuth will redirect back here by default
    // return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl || "")}`)
    return redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl || "")}`)

  }
  return session
}
