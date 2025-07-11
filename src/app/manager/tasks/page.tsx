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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { tasks as initialTasks, employees, Task, TaskStatus, clients } from "@/lib/data";
import { Rating } from '@/components/rating';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignees, setNewTaskAssignees] = useState<string[]>([]);
  const [newTaskClient, setNewTaskClient] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };
  
  const handleRatingSubmit = (task: Task) => {
    setTasks(tasks.map(t => t.id === task.id ? {...t, rating: rating} : t));
    toast({
      title: "Rating Submitted!",
      description: `You gave the team ${rating} stars for completing "${task.title}".`,
    });
    setRating(0);
  };

  const handleCreateTask = () => {
    if (!newTaskTitle || newTaskAssignees.length === 0 || !newTaskClient || !newTaskDueDate) {
       toast({
        title: "Error",
        description: "Please fill out all fields to create a task.",
        variant: "destructive"
      });
      return;
    }
    const newTask: Task = {
      id: `T${tasks.length + 1}`,
      title: newTaskTitle,
      description: newTaskDescription,
      assignees: newTaskAssignees,
      client: newTaskClient,
      dueDate: format(new Date(newTaskDueDate), 'yyyy-MM-dd'),
      status: 'Pending',
      rating: 0,
    };
    setTasks([...tasks, newTask]);
    toast({
      title: "Task Created!",
      description: `Task "${newTask.title}" has been assigned.`
    });
    
    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignees([]);
    setNewTaskClient('');
    setNewTaskDueDate('');
    setIsCreateDialogOpen(false);
  }

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
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Task Manager</CardTitle>
            <CardDescription>
              Assign, track, and update task statuses across your team.
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Create a New Task</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create and assign a new task.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea id="description" value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-start gap-4 pt-2">
                  <Label className="text-right pt-2">Assignees</Label>
                   <Popover>
                      <PopoverTrigger asChild>
                          <Button variant="outline" className="col-span-3 justify-between font-normal h-auto">
                              <div className="flex flex-wrap gap-1 items-center">
                                {newTaskAssignees.length > 0 ? (
                                    <>
                                     {newTaskAssignees.slice(0, 2).map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                                     {newTaskAssignees.length > 2 && <Badge variant="outline">+{newTaskAssignees.length - 2}</Badge>}
                                    </>
                                ) : "Select Employees"}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                          <div className="p-2 space-y-1">
                             {employees.map(e => (
                                <div key={e.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                                    <Checkbox
                                        id={`assignee-${e.id}`}
                                        checked={newTaskAssignees.includes(e.name)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                                ? setNewTaskAssignees([...newTaskAssignees, e.name])
                                                : setNewTaskAssignees(newTaskAssignees.filter(name => name !== e.name))
                                        }}
                                    />
                                    <Label htmlFor={`assignee-${e.id}`} className="font-normal flex flex-col w-full cursor-pointer">
                                        {e.name}
                                        <span className="text-xs text-muted-foreground">{e.role}</span>
                                    </Label>
                                </div>
                            ))}
                          </div>
                      </PopoverContent>
                   </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client" className="text-right">Client</Label>
                   <Select onValueChange={setNewTaskClient} value={newTaskClient}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                            <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                  <Input id="dueDate" type="date" value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Assignees</TableHead>
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
                <TableCell>
                    <div className="flex flex-col gap-1">
                        {task.assignees.map(assignee => <Badge key={assignee} variant="secondary" className="font-normal w-fit">{assignee}</Badge>)}
                    </div>
                </TableCell>
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
                      <DialogContent className="sm:max-w-xs">
                        <DialogHeader>
                          <DialogTitle>Rate Employee Performance</DialogTitle>
                          <DialogDescription>
                            Task: "{task.title}" by {task.assignees.join(', ')}
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
