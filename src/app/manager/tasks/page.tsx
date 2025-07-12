'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Task, TaskStatus, Employee, Client, NotificationMessage } from "@/lib/data";
import { Rating } from '@/components/rating';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import TaskModel from '@/models/Task';
import EmployeeModel from '@/models/Employee';
import ClientModel from '@/models/Client';
import MessageModel from '@/models/Message';


async function getTasks() {
    try {
        const tasks = await TaskModel.find({}).lean();
        return JSON.parse(JSON.stringify(tasks));
    } catch (error) {
        console.error("Failed to fetch tasks", error);
        return [];
    }
}

async function getEmployees() {
    try {
        const employees = await EmployeeModel.find({}).lean();
        return JSON.parse(JSON.stringify(employees));
    } catch (error) {
        console.error("Failed to fetch employees", error);
        return [];
    }
}

async function getClients() {
    try {
        const clients = await ClientModel.find({}).lean();
        return JSON.parse(JSON.stringify(clients));
    } catch (error) {
        console.error("Failed to fetch clients", error);
        return [];
    }
}

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignees, setNewTaskAssignees] = useState<string[]>([]);
  const [newTaskClient, setNewTaskClient] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  useEffect(() => {
    async function loadData() {
        const [tasksData, employeesData, clientsData] = await Promise.all([
            getTasks(),
            getEmployees(),
            getClients()
        ]);
        setTasks(tasksData);
        setEmployees(employeesData);
        setClients(clientsData);
    }
    loadData();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
        await TaskModel.findOneAndUpdate({ id: taskId }, { status: newStatus });
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        ));
    } catch (error) {
        console.error("Failed to update task status", error);
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };
  
  const handleRatingSubmit = async (task: Task) => {
    try {
      await TaskModel.findOneAndUpdate({ id: task.id }, { rating: rating });
      setTasks(tasks.map(t => t.id === task.id ? {...t, rating: rating} : t));
      toast({
        title: "Rating Submitted!",
        description: `You gave the team ${rating} stars for completing "${task.title}".`,
      });
      setRating(0);
    } catch (error) {
      console.error("Failed to submit rating", error);
      toast({ title: "Error", description: "Failed to submit rating", variant: "destructive" });
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle || newTaskAssignees.length === 0 || !newTaskClient || !newTaskDueDate) {
       toast({
        title: "Error",
        description: "Please fill out all fields to create a task.",
        variant: "destructive"
      });
      return;
    }

    const tasksCount = await TaskModel.countDocuments();
    const newTaskId = `T${tasksCount + 1}`;
    
    const newTaskData: Task = {
      id: newTaskId,
      title: newTaskTitle,
      description: newTaskDescription,
      assignees: newTaskAssignees,
      client: newTaskClient,
      dueDate: format(new Date(newTaskDueDate), 'yyyy-MM-dd'),
      status: 'Pending',
      rating: 0,
      createdBy: 'Alex Doe', // Logged in manager
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      comments: [],
    };
    
    const messagesCount = await MessageModel.countDocuments();
    const newNotificationData: NotificationMessage = {
      id: `M${messagesCount + 1}`,
      type: 'notification',
      content: `created a new task "${newTaskData.title}" and assigned it to ${newTaskData.assignees.join(', ')}.`,
      authorId: '1', // Alex Doe
      timestamp: new Date().toISOString(),
      taskId: newTaskData.id,
    };

    try {
        const newTask = new TaskModel(newTaskData);
        const newNotification = new MessageModel(newNotificationData);
        
        await Promise.all([
            newTask.save(),
            newNotification.save()
        ]);
        
        setTasks([...tasks, newTaskData]);

        toast({
          title: "Task Created!",
          description: `Task "${newTaskTitle}" has been assigned.`
        });
        
        // Reset form
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskAssignees([]);
        setNewTaskClient('');
        setNewTaskDueDate('');
        setIsCreateDialogOpen(false);
    } catch (error) {
        console.error("Failed to create task", error);
        toast({ title: "Error", description: "Failed to create task", variant: "destructive" });
    }
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
                <TableCell className="font-medium">
                  <Link href={`/tasks/${task.id}`} className="hover:underline">{task.title}</Link>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        {task.assignees.map(assignee => <Badge key={assignee} variant="secondary" className="font-normal w-fit">{assignee}</Badge>)}
                    </div>
                </TableCell>
                <TableCell>{task.client}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                  <Select 
                    value={task.status} 
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
