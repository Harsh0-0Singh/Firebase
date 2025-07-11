import { AppLayout, type NavLink } from "@/components/app-layout";
import { clients } from "@/lib/data";

export default function ClientLayout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: { clientId: string }
}) {
    const client = clients.find(c => c.id === params.clientId);
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
