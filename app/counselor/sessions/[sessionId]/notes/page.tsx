import { SessionNotesEditor } from "@/components/counselor/SessionNotesEditor";
import { MessageSquare } from "lucide-react";

// This page would typically fetch session and student details based on sessionId
export default function SessionNotesPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params;
  // In a real app, fetch studentName based on sessionId
  const studentName = "Demo Student"; // Placeholder

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline">Session Workspace</h1>
      </div>
       <p className="text-muted-foreground">
        Record session notes, manage call transcripts, and utilize AI tools for summarization.
      </p>
      <SessionNotesEditor sessionId={sessionId} studentName={studentName} />
    </div>
  );
}
