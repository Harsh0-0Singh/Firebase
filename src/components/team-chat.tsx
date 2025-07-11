'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { employees, messages as initialMessages, Message, ChatMessage, NotificationMessage } from "@/lib/data";
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';
import { Megaphone, Send } from 'lucide-react';

interface TeamChatProps {
    userId: string;
}

export function TeamChat({ userId }: TeamChatProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const currentUser = employees.find(e => e.id === userId);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !currentUser) return;

        const chatMessage: ChatMessage = {
            id: `M${messages.length + 1}`,
            type: 'chat',
            authorId: currentUser.id,
            content: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages([...messages, chatMessage]);
        setNewMessage('');
    };

    const getAuthor = (authorId: string) => {
        return employees.find(e => e.id === authorId);
    };

    const renderMessageContent = (message: Message) => {
        const author = getAuthor(message.authorId);
        if (!author) return null;

        if (message.type === 'notification') {
             return (
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" />
                    <div>
                        <span className="font-semibold text-foreground">{author.name}</span>
                        <span> {message.content} </span>
                         {message.taskId && (
                            <Link href={`/tasks/${message.taskId}`} className="text-primary hover:underline">
                                View Task
                            </Link>
                        )}
                        <time className="ml-2" title={format(parseISO(message.timestamp), 'PPpp')}>
                           {formatDistanceToNow(parseISO(message.timestamp), { addSuffix: true })}
                        </time>
                    </div>
                </div>
            )
        }

        // Chat message
        return (
             <div className="flex gap-3">
                <Avatar className="h-8 w-8 border">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-baseline gap-2">
                        <p className="font-semibold text-sm">{author.name}</p>
                        <time className="text-xs text-muted-foreground" title={format(parseISO(message.timestamp), 'PPpp')}>
                            {formatDistanceToNow(parseISO(message.timestamp), { addSuffix: true })}
                        </time>
                    </div>
                    <p className="text-sm text-foreground bg-muted p-2 rounded-lg">{message.content}</p>
                </div>
            </div>
        )
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Team Hub</CardTitle>
                <CardDescription>Announcements, discussions, and updates.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                       {messages.sort((a,b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime()).map(message => (
                           <div key={message.id}>
                            {renderMessageContent(message)}
                           </div>
                       ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4 border-t">
                <div className="flex w-full items-center space-x-2">
                    <Input 
                        placeholder="Type a message..." 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
