'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ResourceRequest, resourceRequests as initialRequests, employees } from "@/lib/data";
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ManagerResourcesPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { toast } = useToast();

  const handleOpenApprovalDialog = (request: ResourceRequest) => {
    setSelectedRequest(request);
    setAssigneeId(request.assignedToId || '');
    setDueDate(request.dueDate ? format(parseISO(request.dueDate), 'yyyy-MM-dd') : '');
  };
  
  const handleCloseDialog = () => {
    setSelectedRequest(null);
    setAssigneeId('');
    setDueDate('');
  }

  const handleApproval = () => {
    if (!selectedRequest || !assigneeId || !dueDate) {
      toast({
        title: "Error",
        description: "Please assign the request and set a due date.",
        variant: "destructive"
      });
      return;
    }

    const updatedRequests = requests.map(r => 
      r.id === selectedRequest.id 
        ? { ...r, status: 'Approved' as const, assignedToId: assigneeId, dueDate: dueDate }
        : r
    );
    setRequests(updatedRequests);
    
    toast({
      title: "Request Approved",
      description: `${selectedRequest.itemName} for ${selectedRequest.requesterName} has been approved.`
    });

    handleCloseDialog();
  };

  const handleReject = (requestId: string) => {
    const updatedRequests = requests.map(r => 
      r.id === requestId ? { ...r, status: 'Rejected' as const } : r
    );
    setRequests(updatedRequests);
    toast({
      title: "Request Rejected",
      variant: "destructive"
    });
  };
  
  const handleComplete = (requestId: string) => {
    const updatedRequests = requests.map(r => 
      r.id === requestId ? { ...r, status: 'Completed' as const } : r
    );
    setRequests(updatedRequests);
     toast({
      title: "Marked as Completed",
    });
  };
  
  const getStatusColor = (status: ResourceRequest['status']) => {
    switch (status) {
      case 'Approved': return 'bg-blue-500 hover:bg-blue-600';
      case 'Completed': return 'bg-green-500 hover:bg-green-600';
      case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Rejected': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  }

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Resource Requests</CardTitle>
          <CardDescription>
            Review and manage resource requests from your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Requested On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.requesterName}</TableCell>
                  <TableCell>{request.itemName}</TableCell>
                  <TableCell>{format(parseISO(request.createdAt), 'PPP')}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-white", getStatusColor(request.status))}>{request.status}</Badge>
                  </TableCell>
                  <TableCell>{request.assignedToId ? getEmployeeName(request.assignedToId) : 'N/A'}</TableCell>
                  <TableCell>{request.dueDate ? format(parseISO(request.dueDate), 'PPP') : 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {request.status === 'Pending' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="default" size="sm" onClick={() => handleOpenApprovalDialog(request)}>Approve</Button>
                        </DialogTrigger>
                        <Button variant="destructive" size="sm" onClick={() => handleReject(request.id)}>Reject</Button>
                      </Dialog>
                    )}
                    {request.status === 'Approved' && (
                      <Button variant="secondary" size="sm" onClick={() => handleComplete(request.id)}>Mark Completed</Button>
                    )}
                    {request.status === 'Completed' && (
                      <span className="text-sm text-muted-foreground">Fulfilled</span>
                    )}
                    {request.status === 'Rejected' && (
                      <span className="text-sm text-destructive">Rejected</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">No resource requests.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
           <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Request: {selectedRequest.itemName}</DialogTitle>
                <DialogDescription>
                  Assign this request to an employee and set a due date for fulfillment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                  <Label>Reason by {selectedRequest.requesterName}</Label>
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{selectedRequest.reason}</p>
                 </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assign to</Label>
                  <Select onValueChange={setAssigneeId} value={assigneeId}>
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input 
                    id="due-date" 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleApproval}>Approve & Assign</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
