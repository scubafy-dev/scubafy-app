// app/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/lib/auth";
import { Role } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { getUserRole } from "@/lib/auth";

export default function RoleSelectionClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [role, setRole] = useState<"staff" | "manager" | null>(null);
    const [inviteCode, setInviteCode] = useState<string>("");

    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") ?? "/";

    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkUserRole = async () => {
            if (status === "loading") {
                return;
            }
            if (!session || !session.user || !session.user.email) {
                router.push("/signin");
                return;
            }

            const role = await getUserRole(session.user.email);
            if (role) {
                // Redirect to the dashboard based on their role
                // if (user.role === Role.manager) {
                //     router.push("/manager/dashboard");
                // } else {
                //     router.push("/staff/dashboard");
                // }
                console.log("User role: ", role);
                console.log("Callback URL: ", callbackUrl);
                router.push(callbackUrl); // Redirect to the callback URL
            } else {
                setIsModalOpen(true);
            }
        };

        checkUserRole();
    }, [session, status, router, callbackUrl]);

    const saveRoleToDatabase = async (selectedRole: "staff" | "manager") => {
        console.log(`User selected: ${selectedRole}`);

        // const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            alert("You must be signed in to select a role.");
            return;
        }
        await updateUserRole(session.user.email, selectedRole as Role);
        router.push(callbackUrl);
    };

    const handleRoleSelection = (selectedRole: "staff" | "manager") => {
        setRole(selectedRole);
        setIsModalOpen(false);
        if (selectedRole === "manager") {
            saveRoleToDatabase("manager");
        } else if (selectedRole === "staff") {
            // Open invite code input for staff
            setRole("staff");
        }
    };

    const handleStaffSetup = () => {
        if (role === "staff" && inviteCode.trim() === "") {
            alert("Please enter a valid invite code");
            return;
        }
        console.log("Staff setup with invite code:", inviteCode);
        saveRoleToDatabase("staff");
    };

    return (
        <div
            className="relative flex items-center justify-center h-screen bg-cover bg-center"
            style={{ backgroundImage: 'url("/dive.jpg")' }}
        >
            <Dialog
                open={isModalOpen && status !== "loading"}
                onOpenChange={setIsModalOpen}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Select a role
                        </DialogTitle>
                    </DialogHeader>
                    <Button
                        onClick={() => handleRoleSelection("staff")}
                        className="px-6 py-3 bg-orange-500 text-white rounded-md m-2"
                    >
                        Staff
                    </Button>
                    <Button
                        onClick={() => handleRoleSelection("manager")}
                        className="px-6 py-3 bg-teal-500 text-white rounded-md m-2"
                    >
                        Manager
                    </Button>
                    {status === "loading" && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Loading...</p>
                        </div>
                    )}

                    {role === "staff" && (
                        <div className="mt-4 flex-col items-center">
                            <div>
                                <label htmlFor="inviteCode" className="text-sm">
                                    Enter your invite code: {" "}
                                </label>
                                <Input
                                    type="text"
                                    id="inviteCode"
                                    value={inviteCode}
                                    onChange={(e) =>
                                        setInviteCode(e.target.value)}
                                    className="mt-2 p-2 border rounded"
                                />
                            </div>
                            <div>
                                <Button
                                    onClick={() => handleStaffSetup()}
                                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
