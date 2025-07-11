'use client';

import { useState } from 'react';
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
import { taskRequests, employees, Employee } from "@/lib/data";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


export default function TaskRequestsPage() {
  const [requests, setRequests] = useState(taskRequests);
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const { toast } = useToast();
  
  const handleApprove = (requestId: string) => {
    if (!selectedAssignee) {
      toast({
        title: 'Error',
        description: 'Please select an employee to assign the task.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would create a new task and update the request status
    setRequests(requests.filter(r => r.id !== requestId));
    
    toast({
      title: 'Task Approved!',
      description: `The request has been approved and assigned to an employee.`,
    });
    setSelectedAssignee('');
  };

  const handleReject = (requestId: string) => {
     setRequests(requests.filter(r => r.id !== requestId));
     toast({
        title: 'Request Rejected',
        description: 'The task request has been rejected.',
        variant: 'destructive',
     })
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
                        <Select onValueChange={setSelectedAssignee}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((e) => (
                                    <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(request.id)}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>Reject</Button>
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
