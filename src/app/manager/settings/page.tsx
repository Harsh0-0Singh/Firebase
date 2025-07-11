'use client';

import { ProfileForm } from "@/components/profile-form";
import { employees } from "@/lib/data";

export default function ManagerSettingsPage() {
  // Mocking the logged-in manager. In a real app, this would come from session/auth context.
  const manager = employees.find(e => e.role === 'Manager');

  if (!manager) {
    return <div>Manager not found.</div>
  }

  return <ProfileForm user={manager} userType="Manager" />;
}
