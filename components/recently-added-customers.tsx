"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiveCenter } from "@/lib/dive-center-context";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  createdAt: string;
  diveCenter: {
    name: string;
  };
}

export function RecentlyAddedCustomers() {
  const { currentCenter, isAllCenters } = useDiveCenter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCustomers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (!isAllCenters && currentCenter) {
          params.append("diveCenterId", currentCenter.id);
        } else {
          params.append("isAllCenters", "true");
        }

        const response = await fetch(`/api/customers/recent?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch recent customers");
        }

        const data = await response.json();
        setCustomers(data.customers);
      } catch (error) {
        console.error("Error fetching recent customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCustomers();
  }, [currentCenter, isAllCenters]);

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recently Added Customers</CardTitle>
          <CardDescription>
            {isAllCenters
              ? "Latest customers across all your centers"
              : `Latest customers from ${currentCenter?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recently Added Customers</CardTitle>
          <CardDescription>
            {isAllCenters
              ? "Latest customers across all your centers"
              : `Latest customers from ${currentCenter?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No customers found</p>
            <p className="text-sm mt-1">
              {isAllCenters
                ? "No customers have been added to your centers yet."
                : "No customers have been added to this center yet."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recently Added Customers</CardTitle>
            <CardDescription>
              {isAllCenters
                ? "Latest customers across all your centers"
                : `Latest customers from ${currentCenter?.name}`}
            </CardDescription>
          </div>
          <Link
            href="/customers"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.id} className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-xs">
                  {getInitials(customer.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                                 <div className="flex items-center justify-between">
                   <p className="text-sm font-medium leading-none">
                     {customer.fullName || 'Unknown Customer'}
                   </p>
                                     <Badge variant="secondary" className="text-xs">
                     {isAllCenters ? (customer.diveCenter?.name || 'Unknown Center') : "Customer"}
                   </Badge>
                </div>
                                 <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                   <Mail className="h-3 w-3" />
                   <span>{customer.email || 'No email'}</span>
                 </div>
                                 {customer.phone && (
                   <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                     <Phone className="h-3 w-3" />
                     <span>{customer.phone || 'No phone'}</span>
                   </div>
                 )}
                                 {customer.location && (
                   <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                     <MapPin className="h-3 w-3" />
                     <span>{customer.location || 'No location'}</span>
                   </div>
                 )}
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Added {formatDate(customer.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 