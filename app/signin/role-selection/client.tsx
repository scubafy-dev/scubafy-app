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
import { useDiveCenter } from "@/lib/dive-center-context";

export default function RoleSelectionClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [role, setRole] = useState<"staff" | "manager" | null>(null);
    const [staffCode, setStaffCode] = useState<string>("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string>("");

    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") ?? "/";

    const router = useRouter();
    const { data: session, status } = useSession();
    const { currentCenter } = useDiveCenter();

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
                console.log("User role: ", role);
                console.log("Callback URL: ", callbackUrl);
                router.push(callbackUrl);
            } else {
                setIsModalOpen(true);
            }
        };

        checkUserRole();
    }, [session, status, router, callbackUrl]);

    const saveRoleToDatabase = async (selectedRole: "staff" | "manager", staffData?: any) => {
        console.log(`User selected: ${selectedRole}`);

        if (!session || !session.user || !session.user.email) {
            alert("You must be signed in to select a role.");
            return;
        }

        try {
            if (selectedRole === "manager") {
                await updateUserRole(session.user.email, selectedRole as Role);
                router.push(callbackUrl);
            } else if (selectedRole === "staff" && staffData) {
                // Store staff data and dive center in localStorage for session management
                localStorage.setItem("staffData", JSON.stringify(staffData));
                if (staffData.diveCenter) {
                    localStorage.setItem("currentDiveCenter", JSON.stringify(staffData.diveCenter));
                }
                router.push(callbackUrl);
            }
        } catch (error) {
            console.error("Error saving role:", error);
            setError("Failed to save role. Please try again.");
        }
    };

    const handleRoleSelection = (selectedRole: "staff" | "manager") => {
        setRole(selectedRole);
        setError("");
        if (selectedRole === "manager") {
            saveRoleToDatabase("manager");
        } else if (selectedRole === "staff") {
            setRole("staff");
        }
    };

    const verifyStaffCode = async () => {
        if (!staffCode.trim()) {
            setError("Please enter a valid staff code");
            return;
        }

        if (!session?.user?.email) {
            setError("User email not found");
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            const response = await fetch("/api/verify-staff-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    staffCode: staffCode.trim(),
                    userEmail: session.user.email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to verify staff code");
                return;
            }

            if (data.success) {
                console.log("Staff verified:", data.staff);
                console.log("Dive center:", data.diveCenter);
                
                // Store dive center information
                if (data.diveCenter) {
                    localStorage.setItem("currentDiveCenter", JSON.stringify(data.diveCenter));
                }
                
                await saveRoleToDatabase("staff", data.staff);
            } else {
                setError(data.error || "Invalid staff code");
            }
        } catch (error) {
            console.error("Error verifying staff code:", error);
            setError("Network error. Please try again.");
        } finally {
            setIsVerifying(false);
        }
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
                                <label htmlFor="staffCode" className="text-sm font-medium">
                                    Enter your staff code:
                                </label>
                                <Input
                                    type="text"
                                    id="staffCode"
                                    value={staffCode}
                                    onChange={(e) => setStaffCode(e.target.value)}
                                    placeholder="Enter the code assigned by your manager"
                                    className="mt-2 p-2 border rounded"
                                    disabled={isVerifying}
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                            <div className="mt-4">
                                <Button
                                    onClick={verifyStaffCode}
                                    disabled={isVerifying || !staffCode.trim()}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-md disabled:opacity-50"
                                >
                                    {isVerifying ? "Verifying..." : "Continue"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
