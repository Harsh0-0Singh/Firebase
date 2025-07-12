
'use client';

import { ProfileForm } from "@/components/profile-form";
import type { Employee } from "@/lib/data";
import { useEffect, useState } from "react";

export default function EmployeeSettingsPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // In a real app, this would come from session/auth context.
    // Fetch employee data here. For now, it's null.
  }, []);
  

  if (!employee) {
    return <div>Loading employee data...</div>
  }

  return <ProfileForm user={employee} userType="Employee" />;
}
