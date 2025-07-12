import { AppLayout, type NavLink } from "@/components/app-layout";
import ClientModel from "@/models/Client";
import connectDB from "@/lib/mongoose";

async function getClient(clientId: string) {
    await connectDB();
    const client = await ClientModel.findOne({ id: clientId }).lean();
    return client ? JSON.parse(JSON.stringify(client)) : null;
}

export default async function ClientLayout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: { clientId: string }
}) {
    const client = await getClient(params.clientId);
    const clientName = client?.name || "Client";
    
    const navLinks: NavLink[] = [
      { href: `/clients/${params.clientId}`, label: "Dashboard", icon: 'LayoutDashboard' },
      { href: `/clients/${params.clientId}/settings`, label: "Settings", icon: 'Settings' }
    ];

  return (
    <AppLayout 
      navLinks={navLinks} 
      userName={clientName}
      userRole="Client"
      userAvatar="https://placehold.co/100x100.png"
    >
      {children}
    </AppLayout>
  );
}
