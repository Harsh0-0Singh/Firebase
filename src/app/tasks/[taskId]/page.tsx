
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, User, UserCheck, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import connectDB from '@/lib/mongoose';
import TaskModel from '@/models/Task';
import type { Task, Comment, Employee } from '@/lib/data';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { transferTask } from '@/app/actions/tasks';
import { getEmployees } from '@/app/actions/employees';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';


async function getTask(taskId: string): Promise<Task | null> {
    await connectDB();
    const task = await TaskModel.findOne({ id: taskId }).lean();
    return task ? JSON.parse(JSON.stringify(task)) : null;
}

function BackButton() {
    const router = useRouter();
    return (
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
    )
}

function CommentSection({ task, getAvatarForRole }: { task: Task, getAvatarForRole: (role:string) => string }) {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(task.comments);

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: `C${(comments || []).length + 1}`,
            authorName: 'Alex Doe', // Mock current user
            authorRole: 'Manager', // Mock current user role
            content: newComment,
            timestamp: new Date().toISOString(),
        };
        // TODO: This should call a server action to save the comment
        setComments([...(comments || []), comment]);
        setNewComment('');
    };

    return (
         <Card>
            <CardHeader>
                <CardTitle>Comments & Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {(comments || []).map(comment => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar>
                                <AvatarImage src={getAvatarForRole(comment.authorRole)} />
                                <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold">
                                        {comment.authorName}
                                        <Badge variant="outline" className="ml-2 text-xs">{comment.authorRole}</Badge>
                                    </p>
                                    <time className="text-xs text-muted-foreground">
                                        {format(parseISO(comment.timestamp), 'PPp')}
                                    </time>
                                </div>
                                <p className="text-sm text-foreground">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <div className="w-full flex gap-3">
                     <Avatar>
                        <AvatarImage src={getAvatarForRole('Manager')} />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="w-full space-y-2">
                        <Textarea 
                            placeholder="Add a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                            Post Comment
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

function TransferTaskDialog({ task, employees, onTaskTransferred }: { task: Task; employees: Employee[]; onTaskTransferred: (newAssignees: string[]) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>(task.assignees);
    const { toast } = useToast();

    const handleTransfer = async () => {
        if (selectedAssignees.length === 0) {
            toast({
                title: 'Error',
                description: 'Please select at least one assignee.',
                variant: 'destructive',
            });
            return;
        }
        
        const result = await transferTask(task.id, selectedAssignees);
        if (result.success) {
            toast({
                title: 'Task Transferred',
                description: `Task "${task.title}" has been successfully transferred.`,
            });
            onTaskTransferred(selectedAssignees);
            setIsOpen(false);
        } else {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });
        }
    };
    
    const handleAssigneeChange = (checked: boolean, employeeName: string) => {
      setSelectedAssignees(prev => {
          const newAssignees = checked 
            ? [...prev, employeeName]
            : prev.filter(name => name !== employeeName);
          return newAssignees;
      });
  }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Shuffle className="mr-2 h-4 w-4" />
                    Transfer Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Task: {task.title}</DialogTitle>
                    <DialogDescription>
                        Select one or more employees to re-assign this task to.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label>Assign to</Label>
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto p-1">
                        {employees.map(employee => (
                            <div key={employee.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`assignee-${employee.id}`}
                                    checked={selectedAssignees.includes(employee.name)}
                                    onCheckedChange={(checked) => handleAssigneeChange(!!checked, employee.name)}
                                />
                                <Label htmlFor={`assignee-${employee.id}`} className="font-normal w-full cursor-pointer">
                                    {employee.name} <span className="text-muted-foreground">({employee.role})</span>
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleTransfer}>Confirm Transfer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


function TaskDetailPageContent({ initialTask, allEmployees }: { initialTask: Task, allEmployees: Employee[] }) {
    const [task, setTask] = useState(initialTask);
    
    const getStatusColor = (status: string) => {
        switch (status) {
        case 'Completed': return 'bg-green-500 hover:bg-green-600';
        case 'In Progress': return 'bg-blue-500 hover:bg-blue-600';
        case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
        case 'Blocked': return 'bg-red-500 hover:bg-red-600';
        default: return 'bg-gray-500';
        }
    }
    
    const getAvatarForRole = (role: string) => {
        switch(role) {
            case 'Manager': return 'https://placehold.co/40x40.png';
            case 'Employee': return 'https://placehold.co/40x40.png';
            case 'Client': return 'https://placehold.co/40x40.png';
            default: return 'https://placehold.co/40x40.png';
        }
    }
    
    const handleTaskTransferred = (newAssignees: string[]) => {
        setTask(prevTask => ({ ...prevTask, assignees: newAssignees }));
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <header className="bg-background border-b">
                <div className="container mx-auto flex items-center p-4">
                    <BackButton />
                    <h1 className="text-xl font-semibold ml-2">Task Details</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">{task.title}</CardTitle>
                            <CardDescription>
                                For client: <span className="font-medium text-primary">{task.client}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{task.description}</p>
                        </CardContent>
                        <CardFooter className="flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Created by:</span>
                                <span className="font-semibold">{task.createdBy}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Created on:</span>
                                <span className="font-semibold">{format(parseISO(task.createdAt), 'PPP')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Due on:</span>
                                <span className="font-semibold">{format(parseISO(task.dueDate), 'PPP')}</span>
                            </div>
                        </CardFooter>
                    </Card>
                    <CommentSection task={task} getAvatarForRole={getAvatarForRole} />
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">Status</h4>
                                <Badge variant="outline" className={cn("text-base text-white", getStatusColor(task.status))}>{task.status}</Badge>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2"><UserCheck /> Assignees</h4>
                                <div className="flex flex-col gap-2">
                                    {task.assignees.map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                                </div>
                            </div>
                        </CardContent>
                         <CardFooter>
                             <TransferTaskDialog task={task} employees={allEmployees} onTaskTransferred={handleTaskTransferred} />
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default function TaskDetailPage({ params }: { params: { taskId: string } }) {
    const [task, setTask] = useState<Task | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        async function loadData() {
            const [taskData, employeesData] = await Promise.all([
                getTask(params.taskId),
                getEmployees()
            ]);
            setTask(taskData);
            setEmployees(employeesData);
        }
        loadData();
    }, [params.taskId]);

    if (!task) {
        // You can show a loading spinner here
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return <TaskDetailPageContent initialTask={task} allEmployees={employees} />;
}
