import { AiAssistantChat } from "@/components/student/AiAssistantChat";
import { Bot } from "lucide-react";

export default function AiAssistantPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center space-x-3">
        <Bot className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline">AI Assistant</h1>
      </div>
      <p className="text-muted-foreground">
        Get instant support and information from our AI-powered assistant. 
        Ask about resources, coping strategies, or common mental health questions.
      </p>
      <div className="flex-grow">
        <AiAssistantChat />
      </div>
    </div>
  );
}
