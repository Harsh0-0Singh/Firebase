import { AppLayout, type NavLink } from "@/components/app-layout";
import connectDB from "@/lib/mongoose";
import EmployeeModel from "@/models/Employee";
import type { Employee } from "@/lib/data";
import { notFound } from "next/navigation";

interface EmployeeLayoutProps {
  children: React.ReactNode;
  params: { employeeId: string };
}

async function getEmployee(employeeId: string): Promise<Employee | null> {
    await connectDB();
    const employee = await EmployeeModel.findOne({ id: employeeId }).lean();
    return employee ? JSON.parse(JSON.stringify(employee)) : null;
}

export default async function EmployeeLayout({ children, params }: EmployeeLayoutProps) {
  const employee = await getEmployee(params.employeeId);

  if (!employee) {
    notFound();
  }

  const navLinks: NavLink[] = [
    { href: `/employee/${params.employeeId}/dashboard`, label: "Dashboard", icon: 'LayoutDashboard' },
    { href: `/employee/${params.employeeId}/tasks`, label: "My Tasks", icon: 'GanttChartSquare' },
    { href: `/employee/${params.employeeId}/requests`, label: "Resource Requests", icon: 'PackagePlus' },
    { href: `/employee/${params.employeeId}/reports/submit`, label: "Submit Report", icon: 'FilePenLine' },
    { href: `/employee/${params.employeeId}/settings`, label: "Settings", icon: 'Settings' },
  ];
  
  return (
    <AppLayout 
      navLinks={navLinks} 
      userName={employee.name}
      userRole="Employee"
      userAvatar={employee.avatar}
    >
      {children}
    </AppLayout>
  );
}
