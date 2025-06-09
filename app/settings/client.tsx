"use client";

import { useState } from "react";
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

export default function SettingsClient() {
    const { toast } = useToast();
    const { theme, setTheme, accentColor, setAccentColor } = useTheme();
    const [activeTab, setActiveTab] = useState("general");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);

            toast({
                title: "Settings saved",
                description: "Your settings have been updated successfully.",
            });
        }, 1000);
    };

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Settings"
                text="Manage your dive center settings and preferences."
            >
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />{" "}
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </DashboardHeader>

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
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>
                                Manage your dive center's basic information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="company-name">
                                    Dive Center Name
                                </Label>
                                <Input
                                    id="company-name"
                                    defaultValue="Scubafy Dive Center"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-email">
                                    Contact Email
                                </Label>
                                <Input
                                    id="contact-email"
                                    type="email"
                                    defaultValue="info@scubafy.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-phone">
                                    Contact Phone
                                </Label>
                                <Input
                                    id="contact-phone"
                                    defaultValue="+1 (555) 123-4567"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    defaultValue="123 Ocean Drive, Beach City, FL 33123"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    defaultValue="https://scubafy.com"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
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
                        <CardContent className="space-y-6">
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
                        </CardFooter>
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
                        <CardContent className="space-y-6">
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
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardShell>
    );
}
