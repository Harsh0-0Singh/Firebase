
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type Employee, type Task } from "@/lib/data";
import Link from 'next/link';
import { Star, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { TeamChat } from "@/components/team-chat";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongoose";
import EmployeeModel from "@/models/Employee";
import TaskModel from "@/models/Task";

async function getEmployeeData(employeeId: string) {
    await connectDB();
    const employee = await EmployeeModel.findOne({ id: employeeId }).lean();
    if (!employee) {
        return null;
    }
    const tasks = await TaskModel.find({ assignees: employee.name }).lean();
    return {
        employee: JSON.parse(JSON.stringify(employee)) as Employee,
        tasks: JSON.parse(JSON.stringify(tasks)) as Task[],
    }
}


export default async function EmployeeDashboard({ params }: { params: { employeeId: string } }) {
  const data = await getEmployeeData(params.employeeId);

  if (!data) {
    notFound();
  }

  const { employee, tasks: myTasks } = data;
  
  const completedTasks = myTasks.filter(t => t.status === "Completed").length;
  const inProgressTasks = myTasks.filter(t => t.status === "In Progress").length;
  const completionRate = myTasks.length > 0 ? (completedTasks / myTasks.length) * 100 : 0;
  
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {employee.name}!</h1>
          <p className="text-muted-foreground">Here's your personal dashboard.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Points</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.points}</div>
              <p className="text-xs text-muted-foreground">Earned from task ratings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                {inProgressTasks} tasks in progress
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionRate} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">{Math.round(completionRate)}% of tasks completed</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>My Active Tasks</CardTitle>
                <CardDescription>Here are your tasks that are not yet completed.</CardDescription>
              </div>
              <Link href={`/employee/${params.employeeId}/tasks`} passHref>
                  <Button variant="outline">View All Tasks</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myTasks.filter(t => t.status !== 'Completed').slice(0, 3).map(task => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            <Link href={`/tasks/${task.id}`}>{task.title}</Link>
                          </TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-white", getStatusColor(task.status))}>{task.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {myTasks.filter(t => t.status !== 'Completed').length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">No active tasks.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
             </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <TeamChat userId={params.employeeId} />
      </div>
    </div>
  );
}
