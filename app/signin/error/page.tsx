"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignInErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case "SubscriptionExpired":
                return {
                    title: "Subscription Expired",
                    description: "Your subscription has expired. Please renew your subscription to continue accessing manager features.",
                    action: "Renew Subscription"
                };
            case "NoSubscription":
                return {
                    title: "No Active Subscription",
                    description: "Manager access requires an active subscription. Please subscribe to continue.",
                    action: "Subscribe Now"
                };
            default:
                return {
                    title: "Sign In Error",
                    description: "There was an error during sign in. Please try again.",
                    action: "Try Again"
                };
        }
    };

    const errorInfo = getErrorMessage(error);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        {errorInfo.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        {errorInfo.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Button variant="default" asChild className="w-full">
                            <Link href="/signin">
                                Back to Sign In
                            </Link>
                        </Button>

                        {error === "SubscriptionExpired" || error === "NoSubscription" ? (
                            <Button variant="secondary" asChild className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                                <Link href="https://www.scubafy.co/#pricing" target="_blank" rel="noopener noreferrer">
                                    {errorInfo.action}
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 