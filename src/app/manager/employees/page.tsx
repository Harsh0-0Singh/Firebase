
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Employee } from "@/lib/data";
import { Medal, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import connectDB from "@/lib/mongoose";
import EmployeeModel from "@/models/Employee";
import { EmployeesList } from "./_components/employees-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const initialRoles = ["Manager", "Developer", "Designer"];


async function getEmployees() {
  try {
    await connectDB();
    const employeesData = await EmployeeModel.find({}).lean();
    return JSON.parse(JSON.stringify(employeesData));
  } catch (error) {
    console.error("Failed to fetch employees", error);
    return [];
  }
}

export default async function ManagerEmployeesPage() {
  const employees: Employee[] = await getEmployees();
  const rankedEmployees = [...employees].sort((a, b) => b.points - a.points);
  const roles = initialRoles; // for now, we can keep this static

  const getMedalColor = (rank: number) => {
    if (rank === 0) return "text-yellow-400";
    if (rank === 1) return "text-gray-400";
    if (rank === 2) return "text-yellow-600";
    return "text-muted-foreground";
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <EmployeesList initialEmployees={employees} initialRoles={roles} />
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="text-primary"/> Team Rankings</CardTitle>
                <CardDescription>Top performing employees based on points.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {rankedEmployees.map((employee, index) => (
                  <li key={employee.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Medal className={cn("h-6 w-6", getMedalColor(index))} />
                       <Avatar className="h-9 w-9">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.role}</p>
                       </div>
                    </div>
                    <div className="font-bold text-lg">{employee.points} pts</div>
                  </li>
                ))}
              </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Manage Roles</CardTitle>
                <CardDescription>Add new job roles and designations.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="New role name..."
                        />
                        <Button>Add</Button>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Existing Roles</label>
                        <div className="flex flex-wrap gap-2">
                            {roles.map(role => (
                                <Badge key={role} variant="secondary">{role}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
