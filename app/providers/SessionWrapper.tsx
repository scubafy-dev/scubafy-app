// app/providers/SessionWrapper.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import SubscriptionCheck from "@/components/SubscriptionCheck";

export function SessionWrapper({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <SubscriptionCheck>
                {children}
            </SubscriptionCheck>
        </SessionProvider>
    );
}
