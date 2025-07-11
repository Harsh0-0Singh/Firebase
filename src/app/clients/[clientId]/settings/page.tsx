'use client';

import { ProfileForm } from "@/components/profile-form";
import { clients } from "@/lib/data";
import { notFound } from "next/navigation";

export default function ClientSettingsPage({ params }: { params: { clientId: string } }) {
  const client = clients.find(c => c.id === params.clientId);

  if (!client) {
    notFound();
  }

  return <ProfileForm user={client} userType="Client" />;
}
