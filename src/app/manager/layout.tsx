import { AppLayout, type NavLink } from "@/components/app-layout";
import { Users } from 'lucide-react';

const navLinks: NavLink[] = [
  { href: "/manager/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/manager/tasks", label: "Tasks", icon: "GanttChartSquare" },
  { href: "/manager/requests", label: "Task Requests", icon: "ClipboardCheck" },
  { href: "/manager/resources", label: "Resource Requests", icon: "PackageSearch" },
  { href: "/manager/employees", label: "Employees", icon: "Users" },
  { href: "/manager/clients", label: "Clients", icon: "Briefcase" },
  { href: "/manager/reports", label: "Reports", icon: "FileText" },
  { href: "/manager/settings", label: "Settings", icon: 'Settings' },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      navLinks={navLinks} 
      userName="Alex Doe"
      userRole="Manager"
      userAvatar="https://placehold.co/100x100.png"
    >
      {children}
    </AppLayout>
  );
}
