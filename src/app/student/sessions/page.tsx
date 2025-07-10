
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, FileText, Video, MessageSquare, Loader2, AlertTriangle, CalendarCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getStudentSessions } from "@/lib/actions";
import { format } from "date-fns";

// Define a type for the session data we expect from the backend
interface Session {
  id: string;
  date: string;
  time: string;
  counselor: string;
  type: string;
  status: 'Upcoming' | 'Completed' | 'Pending' | 'Cancelled';
  notesAvailable: boolean;
  summary: string | null;
  videoRecordingLink?: string;
  chatTranscriptLink?: string;
}

export default function StudentSessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);
      getStudentSessions(user.uid)
        .then(result => {
          if ('error' in result) {
            setError(result.error);
          } else {
            setSessions(result.data as Session[]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const upcomingSessions = sessions.filter(s => s.status === "Upcoming" || s.status === "Pending");
  const pastSessions = sessions.filter(s => s.status === "Completed" || s.status === "Cancelled");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive-foreground mb-2">Failed to Load Sessions</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">{error}</p>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <ClipboardList className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline">My Sessions</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Review your past and upcoming counseling sessions. Access notes, recordings (if available), and manage your appointments.
      </p>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="upcoming">Upcoming Sessions ({upcomingSessions.length})</TabsTrigger>
          <TabsTrigger value="past">Past Sessions ({pastSessions.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcomingSessions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {upcomingSessions.map(session => (
                <Card key={session.id} className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-headline">Session with {session.counselor}</CardTitle>
                        <CardDescription>{format(new Date(session.date), "PPP")} at {session.time}</CardDescription>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1.5 ${session.type.includes('Video') ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'}`}>
                        {session.type.includes('Video') ? <Video className="h-4 w-4"/> : <MessageSquare className="h-4 w-4"/>}
                        {session.type}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Status: <span className="font-medium text-foreground">{session.status}</span></p>
                    <p className="text-sm text-muted-foreground mt-1">Your session is scheduled. You will receive a reminder.</p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button variant="outline" size="sm" disabled>Reschedule (Coming Soon)</Button>
                    <Button variant="destructive" size="sm" disabled>Cancel (Coming Soon)</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <Image src="https://placehold.co/300x200.png" alt="No upcoming sessions" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty student calendar" />
                <p className="text-muted-foreground">You have no upcoming sessions scheduled.</p>
                <Button asChild className="mt-4">
                  <Link href="/student/appointments/request">Request a New Session</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          {pastSessions.length > 0 ? (
            <div className="space-y-6">
              {pastSessions.map(session => (
                <Card key={session.id} className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                     <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-headline">Session with {session.counselor}</CardTitle>
                        <CardDescription>{format(new Date(session.date), "PPP")} at {session.time}</CardDescription>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1.5 ${session.type.includes('Video') ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'}`}>
                         {session.type.includes('Video') ? <Video className="h-4 w-4"/> : <MessageSquare className="h-4 w-4"/>}
                        {session.type}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Status: <span className="font-medium text-foreground">{session.status}</span></p>
                    {session.summary && <p className="mt-2 text-sm bg-secondary/50 p-3 rounded-md">{session.summary}</p>}
                  </CardContent>
                  <CardFooter className="gap-2">
                    {session.notesAvailable && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/student/sessions/${session.id}/notes`}><FileText className="mr-2 h-4 w-4"/>View Notes</Link>
                      </Button>
                    )}
                    {session.type.includes('Video') && (
                       <Button variant="outline" size="sm" disabled>
                         <Video className="mr-2 h-4 w-4"/>Recording (N/A)
                       </Button>
                    )}
                     {session.type.includes('Chat') && (
                       <Button variant="outline" size="sm" disabled>
                         <MessageSquare className="mr-2 h-4 w-4"/>Transcript (N/A)
                       </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <Image src="https://placehold.co/300x200.png" alt="No past sessions" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty history illustration" />
                <p className="text-muted-foreground">You have no past sessions recorded.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
