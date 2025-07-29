"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StartPage() {
    const params = useSearchParams();
    const router = useRouter();
    const plan = params.get("plan");
    const billingCycle = params.get("billing") || params.get("billingCycle");

    useEffect(() => {
        // Store plan information
        if (plan && billingCycle) {
            localStorage.setItem("plan", plan);
            localStorage.setItem("billingCycle", billingCycle);
            console.log("Stored subscription plan:", plan, billingCycle);
        }

        // Redirect to sign-in page
        router.push("/signin");
    }, [plan, billingCycle, router]);

    // Show a loading state while redirecting
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Preparing your subscription...</p>
            </div>
        </div>
    );
}