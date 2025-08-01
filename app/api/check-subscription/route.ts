import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user has a paid subscription
        const subscription = await prisma.userSubscription.findFirst({
            where: {
                customer_email: email,
                status: "paid" // Assuming "paid" is the status for active subscriptions
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('subscription',subscription)

        if (!subscription) {
            console.log(`No subscription found for email: ${email}`);
            return NextResponse.json(
                { 
                    hasPaidSubscription: false,
                    message: "No paid subscription found for this email"
                },
                { status: 200 }
            );
        }

        // // Check if subscription is still active (not expired)
        // const currentTime = Date.now();
        // const periodEnd = Number(subscription.period_end) * 1000; // Convert to milliseconds

        // if (currentTime > periodEnd) {
        //     console.log(`Subscription expired for email: ${email}, period end: ${new Date(periodEnd)}`);
        //     return NextResponse.json(
        //         { 
        //             hasPaidSubscription: false,
        //             message: "Subscription has expired"
        //         },
        //         { status: 200 }
        //     );
        // }

        console.log(`Valid subscription found for email: ${email}, plan: ${subscription.planType}`);
        return NextResponse.json(
            { 
                hasPaidSubscription: true,
                subscription: {
                    planType: subscription.planType,
                    billingCycle: subscription.billingCycle,
                    maxDiveCenters: subscription.maxDiveCenters,
                    periodEnd: Number(subscription.period_end)
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error checking subscription:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 