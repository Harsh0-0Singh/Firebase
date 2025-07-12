
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
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
import { getClients, addClient } from '@/app/actions/clients';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Client'}
        </Button>
    )
}

export default function ManagerClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
        const clientsData = await getClients();
        setClients(clientsData);
    }
    loadData();
  }, []);
  
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(addClient, initialState);

  useEffect(() => {
    if (state?.message?.startsWith('Added client')) {
        toast({
            title: "Client Added",
            description: state.message,
        });
        setIsDialogOpen(false);
        router.refresh();
    } else if (state?.message) {
        toast({
            title: "Error",
            description: state.message,
            variant: "destructive"
        });
    }
  }, [state, toast, router]);
  
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
                <form action={dispatch}>
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new client.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" placeholder="e.g. Innovate Corp" />
                      {state?.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input id="contactEmail" name="contactEmail" type="email" placeholder="e.g. contact@innovate.com" />
                      {state?.errors?.contactEmail && <p className="text-sm text-destructive">{state.errors.contactEmail[0]}</p>}
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" name="username" placeholder="e.g. innovatecorp" />
                      {state?.errors?.username && <p className="text-sm text-destructive">{state.errors.username[0]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" placeholder="Set an initial password" />
                      {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
                    </div>
                  </div>
                  <DialogFooter>
                    <SubmitButton />
                  </DialogFooter>
                </form>
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
