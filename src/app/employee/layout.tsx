import { AppLayout, type NavLink } from "@/components/app-layout";

const navLinks: NavLink[] = [
  { href: "/employee/dashboard", label: "Dashboard", icon: 'LayoutDashboard' },
  { href: "/employee/tasks", label: "My Tasks", icon: 'GanttChartSquare' },
  { href: "/employee/requests", label: "Resource Requests", icon: 'PackagePlus' },
  { href: "/employee/reports/submit", label: "Submit Report", icon: 'FilePenLine' },
  { href: "/employee/settings", label: "Settings", icon: 'Settings' },
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
