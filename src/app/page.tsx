'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would make an API call to a login endpoint.
    // Here we will simulate it. We can create a dedicated server action later.
    
    // This is a simplified example. A proper implementation would involve fetching users from DB.
    // For now, we will have a hardcoded check for the initial manager.
    if (username === 'base' && password === 'Base@!9098') {
        toast({
            title: 'Login Successful',
            description: `Welcome! Redirecting you to the manager dashboard.`,
        });
        router.push('/manager/dashboard');
        return;
    }

    // A real implementation would query the database for the user.
    // For now, this part is disabled until other user data is in the DB.
    toast({
        title: 'Login Failed',
        description: 'Invalid username or password. Please try again.',
        variant: 'destructive',
    });
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-background/80">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 border rounded-full bg-primary/10 border-primary/20">
              <Globe
                className="w-10 h-10 text-primary"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold font-headline">
            Welcome to Brands in House
          </CardTitle>
          <CardDescription>
            Login to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
