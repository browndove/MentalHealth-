'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AiChatSchema, type AiChatInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { handleAiAssistantChat } from '@/lib/actions';
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface AiAssistantChatProps {
    conversationId: string | null;
    initialMessages: Message[];
}

export function AiAssistantChat({ conversationId: initialConversationId, initialMessages }: AiAssistantChatProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
    setConversationId(initialConversationId);
  }, [initialMessages, initialConversationId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const form = useForm<AiChatInput>({
    resolver: zodResolver(AiChatSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(values: AiChatInput) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not authenticated' });
      return;
    }

    setIsLoading(true);
    const newUserMessage: Message = { id: Date.now().toString(), text: values.message, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    form.reset();

    const result = await handleAiAssistantChat({
      message: values.message,
      conversationId: conversationId,
      userId: user.uid,
    });
    
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'AI Assistant Error',
        description: result.error,
      });
      const errorResponse: Message = { id: (Date.now() + 1).toString(), text: result.error, sender: 'ai' };
      setMessages(prev => [...prev, errorResponse]);
    } else if (result.answer && result.conversationId) {
      const aiResponse: Message = { id: (Date.now() + 1).toString(), text: result.answer, sender: 'ai' };
      setMessages(prev => [...prev, aiResponse]);
      
      // If this was a new conversation, we need to redirect to the new URL
      // and refresh the layout to show the new chat in the sidebar.
      if (!conversationId) {
        router.push(`/student/ai-assistant/${result.conversationId}`, { scroll: false });
        router.refresh(); 
      }
      setConversationId(result.conversationId);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end space-x-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-xs lg:max-w-xl p-3 rounded-xl shadow ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-card text-card-foreground border rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.sender === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent text-accent-foreground"><User size={18} /></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
           <div className="flex items-end space-x-2">
             <Avatar className="h-8 w-8">
               <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
             </Avatar>
             <div className="p-3 rounded-xl shadow bg-card text-card-foreground border rounded-bl-none">
                <Loader2 className="h-5 w-5 animate-spin"/>
             </div>
           </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Type your message..." {...field} autoComplete="off" disabled={isLoading} />
                  </FormControl>
                  <FormMessage className="text-xs px-1" />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isLoading || !form.formState.isValid || form.getValues("message") === ""}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
