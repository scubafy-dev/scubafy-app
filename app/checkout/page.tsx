// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { DashboardShell } from "@/components/dashboard-shell";
// import { DashboardHeader } from "@/components/dashboard-header";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export default function CheckoutPage() {
//     const params = useSearchParams();
//     const plan = params.get("plan");
//     const billingCycle = params.get("billingCycle");

//     // Simple placeholder for now
//     return (
//         <DashboardShell>
//             <DashboardHeader heading="Complete Your Subscription" text="Review your plan selection and complete your subscription" />

//             <Card>
//                 <CardHeader>
//                     <CardTitle>
//                         {plan === "basic" ? "Basic Plan" :
//                             plan === "pro" ? "Pro Bundle" :
//                                 "Enterprise Plan"}
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <p>Billing: {billingCycle === "monthly" ? "Monthly" : "Yearly"}</p>
//                     <Button className="mt-4">Continue to Payment</Button>
//                 </CardContent>
//             </Card>
//         </DashboardShell>
//     );
// }

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

// Create a separate component for the checkout content
function CheckoutContent() {
    const params = useSearchParams();
    const plan = params.get("plan");
    const billingCycle = params.get("billingCycle");

    return (
        <DashboardShell>
            <DashboardHeader heading="Complete Your Subscription" text="Review your plan selection and complete your subscription" />

            <Card>
                <CardHeader>
                    <CardTitle>
                        {plan === "basic" ? "Basic Plan" :
                            plan === "pro" ? "Pro Bundle" :
                                "Enterprise Plan"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Billing: {billingCycle === "monthly" ? "Monthly" : "Yearly"}</p>
                    <Button className="mt-4">Continue to Payment</Button>
                </CardContent>
            </Card>
        </DashboardShell>
    );
}

// Main page component with Suspense boundary
export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <DashboardShell>
                <DashboardHeader heading="Loading..." text="Please wait while we load your subscription details" />
            </DashboardShell>
        }>
            <CheckoutContent />
        </Suspense>
    );
}