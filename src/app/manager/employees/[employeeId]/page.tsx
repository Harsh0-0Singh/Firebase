
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmployeeModel from "@/models/Employee";
import TaskModel from "@/models/Task";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Rating } from "@/components/rating";
import connectDB from "@/lib/mongoose";
import type { Task, Employee } from "@/lib/data";

async function getEmployeeData(employeeId: string) {
    await connectDB();
    const employee = await EmployeeModel.findOne({ id: employeeId }).lean();
    if (!employee) {
        return null;
    }
    const tasks = await TaskModel.find({ assignees: employee.name }).lean();
    return {
        employee: JSON.parse(JSON.stringify(employee)) as Employee,
        tasks: JSON.parse(JSON.stringify(tasks)),
    }
}


export default async function EmployeeProfilePage({ params }: { params: { employeeId: string } }) {
  const data = await getEmployeeData(params.employeeId);

  if (!data) {
    notFound();
  }
  
  const { employee, tasks: employeeTasks } = data;

  const completedTasks = employeeTasks.filter((task: Task) => task.status === "Completed").length;
  const inProgressTasks = employeeTasks.filter((task: Task) => task.status === "In Progress").length;
  const totalTasks = employeeTasks.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500 hover:bg-green-600';
      case 'In Progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Blocked': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="person" />
            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{employee.name}</h1>
            <p className="text-muted-foreground">{employee.role}</p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/manager/employees">Back to Employees</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employee.points}</div>
            <p className="text-xs text-muted-foreground">From task ratings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">Out of {totalTasks} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks > 0 ? `${Math.round((completedTasks/totalTasks)*100)}%` : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Based on assigned tasks</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assigned Tasks</CardTitle>
          <CardDescription>A complete list of tasks assigned to {employee.name}.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeTasks.length > 0 ? employeeTasks.map((task: Task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                         <Link href={`/tasks/${task.id}`} className="hover:underline">{task.title}</Link>
                      </TableCell>
                      <TableCell>{task.client}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-white", getStatusColor(task.status))}>{task.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                          {task.rating > 0 ? (
                              <div className="flex justify-end">
                                 <Rating count={5} value={task.rating} readOnly size={16} />
                              </div>
                          ) : (
                              <span className="text-muted-foreground text-xs">Not Rated</span>
                          )}
                      </TableCell>
                    </TableRow>
                  )) : (
                      <TableRow>
                          <TableCell colSpan={5} className="text-center h-24">No tasks assigned yet.</TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
