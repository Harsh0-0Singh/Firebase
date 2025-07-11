import { AppLayout, type NavLink } from "@/components/app-layout";

const navLinks: NavLink[] = [
  { href: "/manager/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/manager/tasks", label: "Tasks", icon: "GanttChartSquare" },
  { href: "/manager/reports", label: "Reports", icon: "FileText" },
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
