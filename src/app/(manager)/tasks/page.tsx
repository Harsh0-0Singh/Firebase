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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { tasks as initialTasks, employees, Task, TaskStatus } from "@/lib/data";
import { Rating } from '@/components/rating';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };
  
  const handleRatingSubmit = (task: Task) => {
    setTasks(tasks.map(t => t.id === task.id ? {...t, rating: rating} : t));
    toast({
      title: "Rating Submitted!",
      description: `You gave ${task.assignee} ${rating} stars for completing "${task.title}".`,
    });
    setRating(0);
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
        <CardTitle>Task Manager</CardTitle>
        <CardDescription>
          Assign, track, and update task statuses across your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{task.client}</TableCell>
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
                <TableCell className="text-right">
                  {task.status === "Completed" && (
                     <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setRating(task.rating)}>
                          {task.rating > 0 ? `Rated ${task.rating}/5` : 'Rate'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rate Employee Performance</DialogTitle>
                          <DialogDescription>
                            Task: "{task.title}" by {task.assignee}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center py-4">
                            <Rating count={5} value={rating} onValueChange={setRating} size={32} />
                        </div>
                        <DialogFooter>
                            <Button onClick={() => handleRatingSubmit(task)}>Submit Rating</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
