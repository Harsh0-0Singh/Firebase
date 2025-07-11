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
import { clients as initialClients, Client } from "@/lib/data";
import { Globe } from 'lucide-react';

export default function ManagerClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [newClientName, setNewClientName] = useState('');
  const [newClientContact, setNewClientContact] = useState('');
  const [newClientUsername, setNewClientUsername] = useState('');
  const [newClientPassword, setNewClientPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddClient = () => {
    if (!newClientName.trim() || !newClientContact.trim() || !newClientUsername.trim() || !newClientPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }

    const newClient: Client = {
      id: `C${clients.length + 1}`,
      name: newClientName,
      contactEmail: newClientContact,
      username: newClientUsername,
      password: newClientPassword
    };

    setClients([...clients, newClient]);
    toast({
      title: "Client Added",
      description: `${newClient.name} has been added.`,
    });

    setNewClientName('');
    setNewClientContact('');
    setNewClientUsername('');
    setNewClientPassword('');
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Innovate Corp"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    Contact Email
                  </Label>
                  <Input
                    id="contact"
                    type="email"
                    value={newClientContact}
                    onChange={(e) => setNewClientContact(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. contact@innovate.com"
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={newClientUsername}
                    onChange={(e) => setNewClientUsername(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. innovatecorp"
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newClientPassword}
                    onChange={(e) => setNewClientPassword(e.target.value)}
                    className="col-span-3"
                    placeholder="Set an initial password"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleAddClient}>Save Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
