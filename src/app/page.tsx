'use client';

import { useActionState } from 'react';
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
import { login } from '@/app/actions/auth';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';

function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    )
}


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const initialState = { message: '', user: null, role: null };
  const [state, formAction] = useActionState(login, initialState);

  useEffect(() => {
    if (state.user && state.role) {
      toast({
        title: 'Login Successful',
        description: `Welcome, ${state.user.name}! Redirecting you to your dashboard.`,
      });
      // This is a simplified way to manage session state for this demo app.
      // In a production app, you would use a more secure session management library.
      setCookie('login_info', JSON.stringify(state), 1);

      if (state.role === 'Manager') {
        router.push('/manager/dashboard');
      } else if (state.role === 'Client') {
        router.push(`/clients/${state.user.id}`);
      } else { // Employee
        router.push(`/employee/${state.user.id}/dashboard`);
      }
    } else if (state.message && !state.user) {
       toast({
        title: 'Login Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, router, toast]);


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
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                name="username"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="Enter your password" 
                required
              />
            </div>
             <div aria-live="polite" aria-atomic="true">
                {state.message && !state.user && <p className="mt-2 text-sm text-destructive">{state.message}</p>}
             </div>
            <LoginButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
