"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Moon, Save, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { useDiveCenter } from "@/lib/dive-center-context";
import { getIndividualDiveCenters, updateDiveCenter } from "@/lib/dive-center";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function SettingsClient() {
    const { toast } = useToast();
    const { theme, setTheme, accentColor, setAccentColor } = useTheme();
    const [activeTab, setActiveTab] = useState("general");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [diveCenterData, setDiveCenterData] = useState<any>(null);
    const { currentCenter, isAllCenters, getCenterSpecificData, setDiveCenters, setCurrentCenter, updateCenter } = useDiveCenter();
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Fetch dive center data when component mounts
    useEffect(() => {
        const fetchDiveCenterData = async () => {
            if (currentCenter?.id) {
                try {
                    setIsLoading(true);
                    const data = await getIndividualDiveCenters(currentCenter.id);
                    setDiveCenterData(data);
                } catch (error) {
                    console.error("Error fetching dive center data:", error);
                    toast({
                        title: "Error",
                        description: "Failed to load dive center data.",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchDiveCenterData();
    }, [currentCenter?.id, toast]);

    const handleSaveDiveCenter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCenter?.id) {
            toast({
                title: "Error",
                description: "No dive center selected.",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);

            // Debug: Log the form data
            console.log("Form data being sent:");
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            console.log("Current center ID:", currentCenter.id);

            const updatedCenter = await updateDiveCenter(currentCenter.id, formData);

            // Update the dive center context with new data
            if (updatedCenter) {
                // Update the center in context using the new updateCenter function
                updateCenter(updatedCenter);

                toast({
                    title: "Success",
                    description: "Dive center settings updated successfully.",
                });

                // Refresh the dive center data
                const refreshedData = await getIndividualDiveCenters(currentCenter.id);
                setDiveCenterData(refreshedData);
            }
        } catch (error) {
            console.error("Error updating dive center:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update dive center settings.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteDiveCenter = async () => {
        if (!currentCenter?.id) {
            toast({
                title: "Error",
                description: "No dive center selected.",
                variant: "destructive",
            });
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch(`/api/dive-center?centerId=${currentCenter.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete dive center");
            const updatedCenters = data.diveCenters;
            setDiveCenters(updatedCenters);
            if (updatedCenters.length > 0) {
                setCurrentCenter(updatedCenters[0]);
                toast({
                    title: "Deleted",
                    description: "Dive center deleted. Switched to another center.",
                });
            } else {
                setCurrentCenter(null);
                toast({
                    title: "No Dive Centers",
                    description: "All dive centers deleted. Please create a new one.",
                    variant: "destructive",
                });
                // Optionally, redirect or open a modal to create a new center
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete dive center.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
            setDeleteDialogOpen(false);
        }
    };



    return (
        <DashboardShell>
            <DashboardHeader
                heading="Settings"
                text="Manage your dive center settings and preferences."
            >
            </DashboardHeader>

            <>
                {
                    isLoading ?
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Loading dive center data...</p>
                            </div>
                        </div>
                        :
                        <Tabs
                            defaultValue="general"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="notifications">
                                    Notifications
                                </TabsTrigger>
                                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Dive Center Settings</CardTitle>
                                        <CardDescription>
                                            Manage your dive center's basic information.
                                        </CardDescription>
                                    </CardHeader>
                                    <form onSubmit={handleSaveDiveCenter}>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Dive Center Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    defaultValue={diveCenterData?.name || ""}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Contact Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={diveCenterData?.email || ""}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contact">
                                                    Contact Phone
                                                </Label>
                                                <Input
                                                    id="contact"
                                                    name="contact"
                                                    defaultValue={diveCenterData?.contact || ""}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Textarea
                                                    id="location"
                                                    name="location"
                                                    defaultValue={diveCenterData?.location || ""}
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <Button type="submit" disabled={isSaving}>
                                                {isSaving ? "Saving..." : "Save Changes"}
                                            </Button>
                                            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                                <AlertDialogTrigger asChild>
                                                    <Button type="button" variant="destructive" disabled={isSaving}>
                                                        Delete Dive Center
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Dive Center?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this dive center? This action cannot be undone and will remove all associated data.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDeleteDiveCenter} disabled={isSaving}>
                                                            {isSaving ? "Deleting..." : "Delete"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notifications">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notification Settings</CardTitle>
                                        <CardDescription>
                                            Configure how you receive notifications.
                                        </CardDescription>
                                    </CardHeader>

                                    {/* Temporarily showing coming soon */}
                                    <CardHeader>
                                        <p className="text-center">Coming Soon...</p>
                                    </CardHeader>
                                    {/* <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications">
                                        Email Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive email notifications for
                                        bookings, cancellations, and reminders.
                                    </p>
                                </div>
                                <Switch
                                    id="email-notifications"
                                    defaultChecked
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="sms-notifications">
                                        SMS Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive text message alerts for urgent
                                        updates.
                                    </p>
                                </div>
                                <Switch id="sms-notifications" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="booking-reminders">
                                        Booking Reminders
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send automatic reminders to customers
                                        before their dive trip.
                                    </p>
                                </div>
                                <Switch id="booking-reminders" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="maintenance-alerts">
                                        Maintenance Alerts
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive alerts when equipment needs
                                        maintenance or inspection.
                                    </p>
                                </div>
                                <Switch
                                    id="maintenance-alerts"
                                    defaultChecked
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter> */}
                                </Card>
                            </TabsContent>

                            <TabsContent value="appearance">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Appearance Settings</CardTitle>
                                        <CardDescription>
                                            Customize the look and feel of your dashboard.
                                        </CardDescription>
                                    </CardHeader>
                                    {/* Temporarily showing coming soon */}
                                    <CardHeader>
                                        <p className="text-center">Coming Soon...</p>
                                    </CardHeader>
                                    {/* <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant={theme === "light"
                                            ? "default"
                                            : "outline"}
                                        onClick={() => setTheme("light")}
                                        className="flex items-center gap-2"
                                    >
                                        <Sun className="h-4 w-4" /> Light
                                    </Button>
                                    <Button
                                        variant={theme === "dark"
                                            ? "default"
                                            : "outline"}
                                        onClick={() => setTheme("dark")}
                                        className="flex items-center gap-2"
                                    >
                                        <Moon className="h-4 w-4" /> Dark
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Accent Color</Label>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="outline"
                                        className={`bg-primary h-8 w-8 rounded-full p-0 ${
                                            accentColor === "default"
                                                ? "ring-2 ring-ring ring-offset-2"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setAccentColor("default")}
                                        aria-label="Default accent color"
                                    />
                                    <Button
                                        variant="outline"
                                        className={`bg-blue-500 h-8 w-8 rounded-full p-0 ${
                                            accentColor === "blue"
                                                ? "ring-2 ring-ring ring-offset-2"
                                                : ""
                                        }`}
                                        onClick={() => setAccentColor("blue")}
                                        aria-label="Blue accent color"
                                    />
                                    <Button
                                        variant="outline"
                                        className={`bg-green-500 h-8 w-8 rounded-full p-0 ${
                                            accentColor === "green"
                                                ? "ring-2 ring-ring ring-offset-2"
                                                : ""
                                        }`}
                                        onClick={() => setAccentColor("green")}
                                        aria-label="Green accent color"
                                    />
                                    <Button
                                        variant="outline"
                                        className={`bg-purple-500 h-8 w-8 rounded-full p-0 ${
                                            accentColor === "purple"
                                                ? "ring-2 ring-ring ring-offset-2"
                                                : ""
                                        }`}
                                        onClick={() => setAccentColor("purple")}
                                        aria-label="Purple accent color"
                                    />
                                    <Button
                                        variant="outline"
                                        className={`bg-amber-500 h-8 w-8 rounded-full p-0 ${
                                            accentColor === "amber"
                                                ? "ring-2 ring-ring ring-offset-2"
                                                : ""
                                        }`}
                                        onClick={() => setAccentColor("amber")}
                                        aria-label="Amber accent color"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="compact-view">
                                        Compact View
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Use a more compact layout for tables and
                                        lists.
                                    </p>
                                </div>
                                <Switch id="compact-view" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="animations">
                                        Animations
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable animations throughout the
                                        dashboard.
                                    </p>
                                </div>
                                <Switch id="animations" defaultChecked />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter> */}
                                </Card>
                            </TabsContent>
                        </Tabs>
                }
            </>

        </DashboardShell>
    );
}
