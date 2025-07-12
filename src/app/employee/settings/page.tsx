
import { ProfileForm } from "@/components/profile-form";
import type { Employee } from "@/lib/data";
import connectDB from "@/lib/mongoose";
import EmployeeModel from "@/models/Employee";
import { notFound } from "next/navigation";

async function getEmployee(employeeId: string): Promise<Employee | null> {
  await connectDB();
  const employee = await EmployeeModel.findOne({ id: employeeId }).lean();
  return employee ? JSON.parse(JSON.stringify(employee)) : null;
}

export default async function EmployeeSettingsPage({ params }: { params: { employeeId: string } }) {
  const employee = await getEmployee(params.employeeId);

  if (!employee) {
    notFound();
  }

  return <ProfileForm user={employee} userType="Employee" />;
}
