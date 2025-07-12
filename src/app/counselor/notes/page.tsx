
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, PlusCircle, FileText, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentSessions } from "@/lib/actions";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

interface Note {
  id: string;
  sessionId: string;
  studentName: string;
  sessionDate: string;
  summaryPreview: string;
  lastUpdated: string;
}

export default function CounselorNotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // In a real app, you'd fetch notes. We're using completed sessions as a proxy.
      const sessionsResult = await getStudentSessions(user.uid, true); // Assume this can fetch for counselor
      if (sessionsResult.error) throw new Error(sessionsResult.error);
      
      const completedSessions = sessionsResult.data.filter(s => s.status === 'Completed');
      
      const formattedNotes = completedSessions.map(session => ({
        id: session.id,
        sessionId: session.id,
        studentName: session.studentName || 'Unknown Student',
        sessionDate: format(new Date(session.date), 'yyyy-MM-dd'),
        summaryPreview: session.reasonPreview || "No preview available.",
        lastUpdated: session.updatedAt ? format(new Date(session.updatedAt.toDate()), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      }));
      setNotes(formattedNotes);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(note =>
    note.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.sessionDate.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Session Notes</h1>
            <p className="text-muted-foreground">Access and manage your confidential session notes.</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative w-full md:w-auto max-w-sm">
            <Input 
              type="search" 
              placeholder="Search notes..." 
              className="pl-10" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button asChild>
            <Link href="/counselor/students">
              <PlusCircle className="mr-2 h-4 w-4" /> New Note
            </Link>
          </Button>
        </div>
      </div>
      
      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle/> Error</CardTitle>
          </CardHeader>
          <CardContent><p className="text-destructive-foreground">{error}</p></CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <CardTitle>{note.studentName}</CardTitle>
                <CardDescription>Session Date: {note.sessionDate}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{note.summaryPreview}</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full">
                  <Link href={`/counselor/sessions/${note.sessionId}/notes`}>
                    <FileText className="mr-2 h-4 w-4" /> View/Edit Note
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <Image src="https://placehold.co/300x200.png" alt="No notes found" width={300} height={200} className="mx-auto mb-4 rounded-xl" data-ai-hint="empty notebook illustration" />
            <h3 className="text-xl font-semibold">No Notes Found</h3>
            <p className="text-muted-foreground mt-2">Create a new note from the student list to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
