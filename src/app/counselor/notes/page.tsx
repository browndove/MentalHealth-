
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, PlusCircle, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Placeholder data for notes
const sessionNotes = [
  {
    id: "note1",
    sessionId: "s1",
    studentName: "Aisha Bello",
    sessionDate: "2024-07-28",
    summaryPreview: "Discussed coping mechanisms for exam stress. Student receptive...",
    lastUpdated: "2024-07-28",
  },
  {
    id: "note2",
    sessionId: "s2",
    studentName: "Kwame Annan",
    sessionDate: "2024-07-25",
    summaryPreview: "Explored challenges with time management and procrastination...",
    lastUpdated: "2024-07-25",
  },
  {
    id: "note3",
    sessionId: "s4",
    studentName: "Chinedu Okoro",
    sessionDate: "2024-07-15",
    summaryPreview: "Initial assessment session. Student expressed feelings of isolation...",
    lastUpdated: "2024-07-15",
  },
];

export default function CounselorNotesPage() {
  // Add search/filter state and logic here
  const filteredNotes = sessionNotes;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline">Session Notes Dashboard</h1>
        </div>
        <div className="flex gap-2 items-center">
            <div className="relative w-full md:w-auto max-w-sm">
            <Input type="search" placeholder="Search notes by student or date..." className="pl-10 rounded-md" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            {/* This button could link to a page to select a student/session THEN open the editor */}
            <Button asChild className="rounded-md">
                <Link href={`/counselor/sessions/new-session-placeholder/notes`}> {/* Replace with actual logic */}
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Note
                </Link>
            </Button>
        </div>
      </div>
      <p className="text-lg text-muted-foreground">
        Access, edit, and manage all your confidential session notes. Use the AI summarizer within each note.
      </p>

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <Card key={note.id} className="hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-headline">{note.studentName}</CardTitle>
                <CardDescription>Session Date: {note.sessionDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{note.summaryPreview}</p>
                <p className="text-xs text-muted-foreground mt-2">Last Updated: {note.lastUpdated}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full rounded-md">
                  <Link href={`/counselor/sessions/${note.sessionId}/notes`}>
                    <FileText className="mr-2 h-4 w-4" /> View/Edit Note
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-xl shadow-md">
          <CardContent className="pt-6 text-center">
            <Image src="https://placehold.co/300x200.png" alt="No notes found" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty notebook illustration Ghana" />
            <p className="text-muted-foreground">No session notes found. Start by creating a new note for a session.</p>
          </CardContent>
        </Card>
      )}
      
      <div className="text-center mt-8">
        {/* Pagination would go here */}
        {filteredNotes.length > 5 && <Button variant="outline" className="rounded-md">Load More Notes</Button>}
      </div>
    </div>
  );
}
