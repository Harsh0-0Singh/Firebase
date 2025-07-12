
'use client';

import { useState, useEffect, useActionState } from 'react';
import Link from 'next/link';
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
import { addEmployee } from '@/app/actions/employees';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Employee'}
        </Button>
    )
}

interface EmployeesListProps {
    initialEmployees: Employee[];
    initialRoles: string[];
}

export function EmployeesList({ initialEmployees, initialRoles }: EmployeesListProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [newRole, setNewRole] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(addEmployee, initialState);

  useEffect(() => {
    if (state.message?.startsWith('Added employee')) {
      toast({
        title: "Employee Added",
        description: state.message,
      });
      setIsDialogOpen(false);
      // We need to refresh the page to see the new employee
      router.refresh();
    } else if (state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive"
      });
    }
  }, [state, toast, router]);


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

  return (
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
  );
}
