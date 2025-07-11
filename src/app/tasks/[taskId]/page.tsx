'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { tasks as initialTasks, Task, Comment } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, User, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

export default function TaskDetailPage({ params }: { params: { taskId: string } }) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const task = tasks.find((t) => t.id === params.taskId);

  const [newComment, setNewComment] = useState('');

  if (!task) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500 hover:bg-green-600';
      case 'In Progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Blocked': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `C${task.comments.length + 1}`,
      authorName: 'Alex Doe', // Mock current user
      authorRole: 'Manager', // Mock current user role
      content: newComment,
      timestamp: new Date().toISOString(),
    };

    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, comments: [...t.comments, comment] } : t
    );
    setTasks(updatedTasks);
    setNewComment('');
  };

  const getAvatarForRole = (role: string) => {
      // In a real app, you'd have user profiles with avatars
      switch(role) {
          case 'Manager': return 'https://placehold.co/40x40.png';
          case 'Employee': return 'https://placehold.co/40x40.png';
          case 'Client': return 'https://placehold.co/40x40.png';
          default: return 'https://placehold.co/40x40.png';
      }
  }


  return (
    <div className="min-h-screen bg-muted/40">
        <header className="bg-background border-b">
            <div className="container mx-auto flex items-center p-4">
                 <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold ml-2">Task Details</h1>
            </div>
        </header>
        <main className="container mx-auto p-4 md:p-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{task.title}</CardTitle>
                        <CardDescription>
                            For client: <span className="font-medium text-primary">{task.client}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{task.description}</p>
                    </CardContent>
                    <CardFooter className="flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Created by:</span>
                            <span className="font-semibold">{task.createdBy}</span>
                        </div>
                         <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Created on:</span>
                            <span className="font-semibold">{format(parseISO(task.createdAt), 'PPP')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Due on:</span>
                            <span className="font-semibold">{format(parseISO(task.dueDate), 'PPP')}</span>
                        </div>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Comments & Discussion</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            {task.comments.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                    <Avatar>
                                        <AvatarImage src={getAvatarForRole(comment.authorRole)} />
                                        <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold">
                                                {comment.authorName}
                                                <Badge variant="outline" className="ml-2 text-xs">{comment.authorRole}</Badge>
                                            </p>
                                            <time className="text-xs text-muted-foreground">
                                                {format(parseISO(comment.timestamp), 'PPp')}
                                            </time>
                                        </div>
                                        <p className="text-sm text-foreground">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full flex gap-3">
                             <Avatar>
                                <AvatarImage src={getAvatarForRole('Manager')} />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className="w-full space-y-2">
                                <Textarea 
                                    placeholder="Add a comment..." 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Task Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">Status</h4>
                            <Badge variant="outline" className={cn("text-base text-white", getStatusColor(task.status))}>{task.status}</Badge>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2"><UserCheck /> Assignees</h4>
                            <div className="flex flex-col gap-2">
                                {task.assignees.map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
