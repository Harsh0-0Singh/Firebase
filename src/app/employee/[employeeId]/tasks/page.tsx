
'use client';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Task, type TaskStatus } from "@/lib/data";
import { Rating } from '@/components/rating';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { updateTaskStatusForEmployee } from '@/app/actions/tasks';
import { useToast } from '@/hooks/use-toast';

interface EmployeeTasksPageContentProps {
    initialTasks: Task[];
}

function EmployeeTasksPageContent({ initialTasks }: EmployeeTasksPageContentProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { toast } = useToast();

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const originalTasks = [...tasks];
    // Optimistically update the UI
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    
    // Call server action
    const result = await updateTaskStatusForEmployee(taskId, newStatus);
    if (!result.success) {
      toast({ title: "Error", description: result.error, variant: 'destructive' });
      // Revert UI on failure
      setTasks(originalTasks);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return 'bg-green-500 hover:bg-green-600';
      case 'In Progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Blocked': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>
          Here is a list of all tasks assigned to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <Link href={`/tasks/${task.id}`} className="hover:underline">{task.title}</Link>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-sm truncate">{task.description}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                  <Select 
                    defaultValue={task.status} 
                    onValueChange={(value: TaskStatus) => handleStatusChange(task.id, value)}
                  >
                    <SelectTrigger className="w-[140px] focus:ring-0 focus:ring-offset-0 border-0 shadow-none p-0 bg-transparent">
                      <SelectValue asChild>
                         <Badge variant="outline" className={cn("text-white", getStatusColor(task.status))}>{task.status}</Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {task.status === "Completed" && task.rating > 0 &&
                    <Rating count={5} value={task.rating} readOnly />
                  }
                </TableCell>
              </TableRow>
            ))}
             {tasks.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">You have no tasks assigned.</TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import connectDB from "@/lib/mongoose";
import EmployeeModel from "@/models/Employee";
import TaskModel from "@/models/Task";
import { notFound } from "next/navigation";

async function getEmployeeTasks(employeeId: string) {
    await connectDB();
    const employee = await EmployeeModel.findOne({ id: employeeId }).lean();
    if (!employee) {
        return null;
    }
    const tasks = await TaskModel.find({ assignees: employee.name }).lean();
    return JSON.parse(JSON.stringify(tasks)) as Task[];
}


export default async function EmployeeTasksPage({ params }: { params: { employeeId: string }}) {
    const tasks = await getEmployeeTasks(params.employeeId);

    if (tasks === null) {
        notFound();
    }
    
    return <EmployeeTasksPageContent initialTasks={tasks} />;
}
