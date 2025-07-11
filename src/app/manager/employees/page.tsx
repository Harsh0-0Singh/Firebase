'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { employees as initialEmployees, Employee } from "@/lib/data";

const initialRoles = ["Manager", "Developer", "Designer"];

export default function ManagerEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [newRole, setNewRole] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeRole, setNewEmployeeRole] = useState<string>(initialRoles[1]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddEmployee = () => {
    if (!newEmployeeName.trim()) {
      toast({
        title: "Error",
        description: "Employee name cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    const newEmployee: Employee = {
      id: `E${employees.length + 1}`,
      name: newEmployeeName,
      role: newEmployeeRole,
      avatar: 'https://placehold.co/40x40.png',
      points: 0,
    };

    setEmployees([...employees, newEmployee]);
    toast({
      title: "Employee Added",
      description: `${newEmployee.name} has been added to the team.`,
    });

    setNewEmployeeName('');
    setNewEmployeeRole(roles[1]);
    setIsDialogOpen(false);
  };

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
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Employees</CardTitle>
              <CardDescription>View, add, or edit employee details.</CardDescription>
            </div>
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Employee</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new employee. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newEmployeeName}
                      onChange={(e) => setNewEmployeeName(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                     <Select onValueChange={(value: string) => setNewEmployeeRole(value)} defaultValue={newEmployeeRole}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleAddEmployee}>Save Employee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
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
                  <TableCell>{employee.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
  );
}
