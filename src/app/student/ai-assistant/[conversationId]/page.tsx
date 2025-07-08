'use client';

import { AiAssistantChat } from "@/components/student/AiAssistantChat";
import { useAuth } from "@/contexts/AuthContext";
import { getConversationMessages } from "@/lib/actions";
import { useEffect, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ConversationPage({ params }: { params: { conversationId: string } }) {
    const { conversationId } = params;
    const { user } = useAuth();
    const [initialMessages, setInitialMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && conversationId) {
            setLoading(true);
            setError(null);
            getConversationMessages(conversationId, user.uid)
                .then(result => {
                    if ('error' in result) {
                        setError(result.error);
                    } else {
                        setInitialMessages(result.messages);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [conversationId, user]);
    
    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }
    
    if (error) {
        return <div className="flex flex-col justify-center items-center h-full text-destructive p-4 text-center">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
        </div>;
    }

    return (
        <AiAssistantChat conversationId={conversationId} initialMessages={initialMessages} />
    );
}
