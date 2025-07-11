'use client';

import { ProfileForm } from "@/components/profile-form";
import { employees } from "@/lib/data";

export default function EmployeeSettingsPage() {
  // Mocking the logged-in employee. In a real app, this would come from session/auth context.
  const employee = employees.find(e => e.id === '2'); // Jane Smith

  if (!employee) {
    return <div>Employee not found.</div>
  }

  return <ProfileForm user={employee} userType="Employee" />;
}
