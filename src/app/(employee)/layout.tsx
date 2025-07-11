import { AppLayout, type NavLink } from "@/components/app-layout";
import { LayoutDashboard, GanttChartSquare, FilePenLine } from "lucide-react";

const navLinks: NavLink[] = [
  { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employee/tasks", label: "My Tasks", icon: GanttChartSquare },
  { href: "/employee/reports/submit", label: "Submit Report", icon: FilePenLine },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      navLinks={navLinks} 
      userName="Jane Smith"
      userRole="Employee"
      userAvatar="https://placehold.co/100x100.png"
    >
      {children}
    </AppLayout>
  );
}
