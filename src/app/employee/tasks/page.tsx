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
import { tasks as initialTasks, Task, TaskStatus } from "@/lib/data";
import { Rating } from '@/components/rating';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function EmployeeTasksPage() {
  const employeeName = 'Jane Smith'; // Mocking logged-in employee
  const myTasks = initialTasks.filter(task => task.assignees.includes(employeeName));
  const [tasks, setTasks] = useState<Task[]>(myTasks);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
