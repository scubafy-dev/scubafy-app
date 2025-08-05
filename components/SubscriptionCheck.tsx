"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Role } from "@/app/generated/prisma";

interface SubscriptionCheckProps {
    children: React.ReactNode;
}

export default function SubscriptionCheck({ children }: SubscriptionCheckProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkSubscription = async () => {
            if (status === "loading") return;

            if (!session?.user?.email || session.user.role !== "manager") {
                setIsChecking(false);
                return;
            }

            try {
                const response = await fetch("/api/check-subscription", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: session.user.email,
                    }),
                });

                const data = await response.json();

                if (!data.hasPaidSubscription) {
                    // Redirect to subscription required page
                    router.push("/subscription-required");
                    return;
                }
            } catch (error) {
                console.error("Error checking subscription:", error);
                // On error, allow access but log the issue
            } finally {
                setIsChecking(false);
            }
        };

        checkSubscription();
    }, [session, status, router]);

    if (status === "loading" || isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Checking subscription...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 