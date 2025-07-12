
import { ProfileForm } from "@/components/profile-form";
import ClientModel from "@/models/Client";
import connectDB from "@/lib/mongoose";
import { notFound } from "next/navigation";

async function getClient(clientId: string) {
    await connectDB();
    const client = await ClientModel.findOne({ id: clientId }).lean();
    return client ? JSON.parse(JSON.stringify(client)) : null;
}

export default async function ClientSettingsPage({ params }: { params: { clientId: string } }) {
  const client = await getClient(params.clientId);

  if (!client) {
    notFound();
  }

  return <ProfileForm user={client} userType="Client" />;
}
