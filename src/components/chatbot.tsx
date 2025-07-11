"use client";

import { useState } from "react";
import { trackTasksWithChatbot } from "@/ai/flows/track-tasks-with-chatbot";
import { Bot, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const { response } = await trackTasksWithChatbot({ query: currentInput });
      const botMessage: Message = { sender: "bot", text: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error with chatbot:", error);
      const errorMessage: Message = {
        sender: "bot",
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Bot className="mr-2" />
          Ask AI Assistant
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:w-3/4 lg:w-1/3">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>AI Task Assistant</SheetTitle>
          <SheetDescription>
            Ask me anything about task statuses, deadlines, or team progress.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 my-4 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "bot" && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback className="bg-transparent">
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback className="bg-transparent">
                    <Bot size={18} />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-3 py-2 bg-muted flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2 border-t"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'What are Jane's pending tasks?'"
            disabled={isLoading}
            autoFocus
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
