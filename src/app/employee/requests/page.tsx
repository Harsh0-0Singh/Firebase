
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { type ResourceRequest } from "@/lib/data";
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

export default function EmployeeRequestsPage() {
  const [requests, setRequests] = useState<ResourceRequest[]>([]); // Mocking logged in as Jane Smith
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [newReason, setNewReason] = useState('');
  const { toast } = useToast();

  const handleSubmitRequest = () => {
    if (!newItem.trim() || !newReason.trim()) {
      toast({
        title: "Error",
        description: "Please fill out all fields for the request.",
        variant: "destructive"
      });
      return;
    }

    const newRequest: ResourceRequest = {
      id: `RES${requests.length + 10}`, // temp id
      requesterId: '2', // Mocked user Jane Smith
      requesterName: 'Jane Smith',
      itemName: newItem,
      reason: newReason,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    setRequests(prev => [newRequest, ...prev]);
    toast({
      title: "Request Submitted",
      description: "Your resource request has been sent for manager approval.",
    });

    setNewItem('');
    setNewReason('');
    setIsDialogOpen(false);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Resource Requests</CardTitle>
            <CardDescription>
              Request new resources and track their approval status.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2" /> New Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Submit a Resource Request</DialogTitle>
                <DialogDescription>
                  Describe the item you need and why you need it.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input 
                    id="item-name" 
                    placeholder="e.g., New MacBook Pro" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Request</Label>
                  <Textarea 
                    id="reason" 
                    placeholder="e.g., My current laptop is too slow for development tasks."
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSubmitRequest}>Submit for Approval</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Requested On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.itemName}</TableCell>
                <TableCell className="text-muted-foreground max-w-sm truncate">{request.reason}</TableCell>
                <TableCell>{format(parseISO(request.createdAt), 'PPP')}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-white", getStatusColor(request.status))}>{request.status}</Badge>
                </TableCell>
                <TableCell>
                    {request.dueDate ? format(parseISO(request.dueDate), 'PPP') : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">You have not made any resource requests.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
