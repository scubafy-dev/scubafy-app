import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SubscriptionRequiredPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Subscription Required
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Manager access requires a paid subscription
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>
                            To access manager features and create dive centers, you need an active subscription.
                        </p>
                        <p className="mt-2">
                            Please contact us to set up your subscription or sign in with a different account.
                        </p>
                    </div>
                    
                    <div className="space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/signin">
                                Back to Sign In
                            </Link>
                        </Button>
                        
                        <Button variant="outline" asChild className="w-full">
                            <Link href="mailto:support@scubafy.com">
                                Contact Support
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 