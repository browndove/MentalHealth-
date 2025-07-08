'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserConversations } from "@/lib/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from "lucide-react";

interface Conversation {
    id: string;
    title: string;
}

export default function AiAssistantLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const pathname = usePathname();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getUserConversations(user.uid).then(result => {
                if (!('error' in result)) {
                    setConversations(result as Conversation[]);
                }
                setIsLoading(false);
            });
        }
    }, [user, pathname]); // Rerun when path changes to refresh list after new chat

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center space-x-3">
                <Bot className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-headline">AI Assistant</h1>
            </div>
            <div className="border rounded-lg shadow-sm flex-grow flex overflow-hidden">
                <div className="w-1/4 min-w-[250px] bg-muted/50 border-r flex flex-col">
                    <div className="p-3 border-b">
                        <Button asChild className="w-full">
                            <Link href="/student/ai-assistant">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Chat
                            </Link>
                        </Button>
                    </div>
                    <ScrollArea className="flex-1">
                        <nav className="p-3 space-y-1">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full p-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : conversations.length > 0 ? (
                                conversations.map(convo => (
                                    <Link
                                        key={convo.id}
                                        href={`/student/ai-assistant/${convo.id}`}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary",
                                            pathname === `/student/ai-assistant/${convo.id}` && "bg-background text-primary shadow-sm"
                                        )}
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        <span className="truncate">{convo.title}</span>
                                    </Link>
                                ))
                            ) : (
                                <p className="p-4 text-center text-xs text-muted-foreground">No past conversations.</p>
                            )}
                        </nav>
                    </ScrollArea>
                </div>
                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </div>
        </div>
    );
}
