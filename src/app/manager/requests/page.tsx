'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskRequest, Employee, Task, NotificationMessage } from "@/lib/data";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import TaskRequestModel from '@/models/TaskRequest';
import EmployeeModel from '@/models/Employee';
import TaskModel from '@/models/Task';
import MessageModel from '@/models/Message';


async function getTaskRequests() {
    try {
        const requests = await TaskRequestModel.find({ status: 'Pending' }).lean();
        return JSON.parse(JSON.stringify(requests));
    } catch (error) {
        console.error("Failed to fetch task requests", error);
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


export default function TaskRequestsPage() {
  const [requests, setRequests] = useState<TaskRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
        const [requestsData, employeesData] = await Promise.all([
            getTaskRequests(),
            getEmployees()
        ]);
        setRequests(requestsData);
        setEmployees(employeesData);
    }
    loadData();
  }, []);
  
  const handleApprove = async (request: TaskRequest) => {
    const assignees = selectedAssignees[request.id] || [];
    if (assignees.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one employee to assign the task.',
        variant: 'destructive',
      });
      return;
    }
    
    const tasksCount = await TaskModel.countDocuments();
    const newTaskId = `T${tasksCount + 1}`;

    const newTaskData: Task = {
      id: newTaskId,
      title: request.title,
      description: request.description,
      assignees: assignees,
      client: request.client,
      dueDate: format(new Date(), 'yyyy-MM-dd'), // Placeholder, should be settable
      status: 'Pending',
      rating: 0,
      createdBy: 'Alex Doe', // Manager approving
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      comments: [],
    };

    const messagesCount = await MessageModel.countDocuments();
    const newNotificationData: NotificationMessage = {
      id: `M${messagesCount + 1}`,
      type: 'notification',
      content: `approved request "${newTaskData.title}" and assigned it to ${newTaskData.assignees.join(', ')}.`,
      authorId: '1', // Alex Doe
      timestamp: new Date().toISOString(),
      taskId: newTaskId,
    };
    
    try {
        const newTask = new TaskModel(newTaskData);
        const newNotification = new MessageModel(newNotificationData);
        
        await Promise.all([
            newTask.save(),
            newNotification.save(),
            TaskRequestModel.findByIdAndUpdate(request._id, { status: 'Approved' })
        ]);

        setRequests(requests.filter(r => r.id !== request.id));
        
        toast({
          title: 'Task Approved!',
          description: `The request "${request.title}" has been approved and assigned.`,
        });

        setSelectedAssignees(prev => {
            const next = {...prev};
            delete next[request.id];
            return next;
        });

    } catch (error) {
        console.error("Failed to approve task", error);
        toast({ title: "Error", description: "Could not approve the task.", variant: "destructive" });
    }
  };

  const handleReject = async (request: TaskRequest) => {
     try {
        await TaskRequestModel.findByIdAndUpdate(request._id, { status: 'Rejected' });
        setRequests(requests.filter(r => r.id !== request.id));
        toast({
            title: 'Request Rejected',
            description: 'The task request has been rejected.',
            variant: 'destructive',
        })
     } catch (error) {
        console.error("Failed to reject task", error);
        toast({ title: "Error", description: "Could not reject the task.", variant: "destructive" });
     }
  }
  
  const handleAssigneeChange = (checked: boolean, requestId: string, employeeName: string) => {
      setSelectedAssignees(prev => {
          const currentAssignees = prev[requestId] || [];
          const newAssignees = checked 
            ? [...currentAssignees, employeeName]
            : currentAssignees.filter(name => name !== employeeName);
          return {
              ...prev,
              [requestId]: newAssignees
          }
      });
  }

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return 'bg-green-500';
    if (status === 'Pending') return 'bg-yellow-500';
    return 'bg-gray-500';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Task Requests</CardTitle>
        <CardDescription>
          Review, approve, and assign new tasks requested by clients.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {requests.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {requests.map((request) => (
              <AccordionItem value={request.id} key={request.id}>
                <AccordionTrigger>
                  <div className='flex justify-between w-full pr-4 items-center'>
                    <div className="flex flex-col text-left">
                        <span className="font-semibold">{request.title}</span>
                        <span className="text-sm text-muted-foreground">From: {request.client}</span>
                    </div>
                    <Badge className={cn('text-white', getStatusColor(request.status))}>{request.status}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
                    <p className="text-muted-foreground mb-4">{request.description}</p>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-sm font-medium">Assign to:</span>
                        <Popover>
                          <PopoverTrigger asChild>
                              <Button variant="outline" className="w-[250px] justify-between font-normal h-auto">
                                  <div className="flex flex-wrap gap-1 items-center">
                                    {(selectedAssignees[request.id] || []).length > 0 ? (
                                        <>
                                        {(selectedAssignees[request.id] || []).slice(0, 2).map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                                        {(selectedAssignees[request.id] || []).length > 2 && <Badge variant="outline">+{ (selectedAssignees[request.id] || []).length - 2}</Badge>}
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
                                            id={`req-assignee-${request.id}-${e.id}`}
                                            checked={(selectedAssignees[request.id] || []).includes(e.name)}
                                            onCheckedChange={(checked) => handleAssigneeChange(!!checked, request.id, e.name)}
                                        />
                                        <Label htmlFor={`req-assignee-${request.id}-${e.id}`} className="font-normal flex flex-col w-full cursor-pointer">
                                            {e.name}
                                            <span className="text-xs text-muted-foreground">{e.role}</span>
                                        </Label>
                                    </div>
                                ))}
                              </div>
                          </PopoverContent>
                       </Popover>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(request)}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(request)}>Reject</Button>
                      </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
            <p className="text-center text-muted-foreground py-8">No pending task requests.</p>
        )}
      </CardContent>
    </Card>
  );
}
