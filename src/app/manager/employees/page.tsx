
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@/lib/data";
import { Medal, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { addEmployee } from '@/app/actions/employees';


const initialRoles = ["Manager", "Developer", "Designer"];

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Employee'}
        </Button>
    )
}

async function getEmployees() {
  try {
    const res = await fetch('/api/employees', { cache: 'no-store' });
    if (!res.ok) {
        console.error("Failed to fetch employees", await res.text());
        return [];
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch employees", error);
    return [];
  }
}

export default function ManagerEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [newRole, setNewRole] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const refetchEmployees = () => {
    getEmployees().then(setEmployees);
  };

  useEffect(() => {
    refetchEmployees();
  }, []);

  const rankedEmployees = [...employees].sort((a, b) => b.points - a.points);
  
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addEmployee, initialState);

  useEffect(() => {
    if (state.message?.startsWith('Added employee')) {
      toast({
        title: "Employee Added",
        description: state.message,
      });
      setIsDialogOpen(false);
      refetchEmployees();
    } else if (state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive"
      });
    }
  }, [state, toast]);


  const handleAddRole = () => {
    if (!newRole.trim() || roles.includes(newRole.trim())) {
      toast({
        title: "Error",
        description: newRole.trim() ? "This role already exists." : "Role name cannot be empty.",
        variant: "destructive"
      });
      return;
    }
    const updatedRoles = [...roles, newRole.trim()];
    setRoles(updatedRoles);
    setNewRole('');
    toast({
      title: 'Role Added',
      description: `The role "${newRole.trim()}" has been successfully added.`
    });
  }

  const getMedalColor = (rank: number) => {
    if (rank === 0) return "text-yellow-400";
    if (rank === 1) return "text-gray-400";
    if (rank === 2) return "text-yellow-600";
    return "text-muted-foreground";
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Manage Employees</CardTitle>
              <CardDescription>View, add, or edit employee details.</CardDescription>
            </div>
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Employee</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form action={dispatch}>
                    <DialogHeader>
                      <DialogTitle>Add New Employee</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new employee. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g. John Doe"
                          aria-describedby="name-error"
                        />
                         <div id="name-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.name && state.errors.name.map((error: string) => <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>)}
                         </div>
                      </div>

                       <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                         <Select name="role" defaultValue={initialRoles[1]}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                       <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="e.g. johndoe"
                           aria-describedby="username-error"
                        />
                         <div id="username-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.username && state.errors.username.map((error: string) => <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>)}
                         </div>
                      </div>

                       <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Set an initial password"
                           aria-describedby="password-error"
                        />
                          <div id="password-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.password && state.errors.password.map((error: string) => <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>)}
                          </div>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        <Link href={`/manager/employees/${employee.id}`} className="hover:underline">
                          {employee.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.role}</Badge>
                      </TableCell>
                      <TableCell>{employee.username}</TableCell>
                      <TableCell>{employee.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="text-primary"/> Team Rankings</CardTitle>
                <CardDescription>Top performing employees based on points.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {rankedEmployees.map((employee, index) => (
                  <li key={employee.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Medal className={cn("h-6 w-6", getMedalColor(index))} />
                       <Avatar className="h-9 w-9">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.role}</p>
                       </div>
                    </div>
                    <div className="font-bold text-lg">{employee.points} pts</div>
                  </li>
                ))}
              </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Manage Roles</CardTitle>
                <CardDescription>Add new job roles and designations.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="New role name..."
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                        />
                        <Button onClick={handleAddRole}>Add</Button>
                    </div>
                    <div className="space-y-2">
                        <Label>Existing Roles</Label>
                        <div className="flex flex-wrap gap-2">
                            {roles.map(role => (
                                <Badge key={role} variant="secondary">{role}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
