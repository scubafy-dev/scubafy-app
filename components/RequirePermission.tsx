import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function RequirePermission({ permission, children }: { permission: string, children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const staffData = localStorage.getItem("staffData");
    if (staffData) {
      try {
        const permissions = JSON.parse(staffData).permissions || [];
        if (permissions.includes(permission)) {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch {
        setAllowed(false);
      }
    } else {
      // Not staff, allow (manager)
      setAllowed(true);
    }
    setChecked(true);
  }, [permission, router]);

  if (!checked) return null; // or a spinner

  if (!allowed) {
    // Optionally show a message or redirect
    return <div className="p-8 text-center text-red-500">You do not have permission to view this page.</div>;
  }

  return <>{children}</>;
} 