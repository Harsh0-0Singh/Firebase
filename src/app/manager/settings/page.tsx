
import { ProfileForm } from "@/components/profile-form";
import EmployeeModel from "@/models/Employee";
import connectDB from "@/lib/mongoose";

async function getManager() {
    await connectDB();
    const manager = await EmployeeModel.findOne({ role: 'Manager' }).lean();
    return manager ? JSON.parse(JSON.stringify(manager)) : null;
}


export default async function ManagerSettingsPage() {
  const manager = await getManager();

  if (!manager) {
    return <div>Manager not found.</div>
  }

  return <ProfileForm user={manager} userType="Manager" />;
}
