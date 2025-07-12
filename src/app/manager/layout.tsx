import { AppLayout, type NavLink } from "@/components/app-layout";
import { Users } from 'lucide-react';
import connectDB from "@/lib/mongoose";
import EmployeeModel from "@/models/Employee";
import type { Employee } from "@/lib/data";

async function getManager(): Promise<Employee | null> {
    await connectDB();
    const manager = await EmployeeModel.findOne({ role: 'Manager' }).lean();
    return manager ? JSON.parse(JSON.stringify(manager)) : null;
}

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

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const manager = await getManager();
  
  return (
    <AppLayout 
      navLinks={navLinks} 
      userName={manager?.name || "Manager"}
      userRole="Manager"
      userAvatar={manager?.avatar || "https://placehold.co/100x100.png"}
    >
      {children}
    </AppLayout>
  );
}
