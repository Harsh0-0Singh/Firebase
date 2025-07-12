
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { type Client } from "@/lib/data";
import { Globe } from 'lucide-react';
import { getClients } from '@/app/actions/clients';


export default function ManagerClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
        const clientsData = await getClients();
        setClients(clientsData);
    }
    loadData();
  }, []);

  const handleAddClient = async () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please fill out both name and email.",
        variant: "destructive"
      });
      return;
    }
    
    // Logic to add client was removed when reverting hashing.
    // This is a placeholder.
    toast({
        title: "Functionality Disabled",
        description: "Adding clients is currently not implemented.",
    });

    setIsDialogOpen(false);
    setName('');
    setEmail('');
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Manage Clients</CardTitle>
            <CardDescription>View and add new clients.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Client</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new client.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" placeholder="e.g. Innovate Corp" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input id="contactEmail" name="contactEmail" type="email" placeholder="e.g. contact@innovate.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddClient}>Save Client</Button>
                  </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right">Portal Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.contactEmail}</TableCell>
                  <TableCell>{client.username}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <a href={`/clients/${client.id}`} target="_blank">
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
