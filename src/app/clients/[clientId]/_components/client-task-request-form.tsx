'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

export function ClientTaskRequestForm() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title');
        
        if (!title) {
            toast({
                title: 'Error',
                description: 'Please provide a title for your task request.',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: 'Request Submitted!',
            description: 'Your task request has been sent to the manager for approval.',
        });
        (e.target as HTMLFormElement).reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="text-primary" />
                    Request a New Task
                </CardTitle>
                <CardDescription>
                    Have a new requirement? Submit the details here for approval.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input id="title" name="title" placeholder="e.g., New feature for homepage" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Provide a detailed description of the task..." />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">Submit for Approval</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
