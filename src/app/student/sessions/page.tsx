
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, FileText, Video, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Placeholder data for sessions
const sessions = [
  {
    id: "s1",
    date: "2024-07-20",
    time: "10:00 AM",
    counselor: "Dr. Emily Carter",
    type: "Video Call",
    status: "Completed",
    notesAvailable: true,
    summary: "Discussed stress management techniques and upcoming exam anxieties. Action items: practice mindfulness for 10 mins daily.",
    videoRecordingLink: "#", // Placeholder
  },
  {
    id: "s2",
    date: "2024-08-05",
    time: "02:00 PM",
    counselor: "Mr. David Lee",
    type: "Chat Session",
    status: "Completed",
    notesAvailable: true,
    summary: "Talked about balancing social life with academic responsibilities. Explored time management strategies.",
    chatTranscriptLink: "#", // Placeholder
  },
  {
    id: "s3",
    date: "2024-08-22",
    time: "11:00 AM",
    counselor: "Dr. Emily Carter",
    type: "Video Call",
    status: "Upcoming",
    notesAvailable: false,
    summary: null,
  },
];

const upcomingSessions = sessions.filter(s => s.status === "Upcoming");
const pastSessions = sessions.filter(s => s.status === "Completed");

export default function StudentSessionsPage() {
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
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 rounded-lg">
          <TabsTrigger value="upcoming" className="rounded-md">Upcoming Sessions ({upcomingSessions.length})</TabsTrigger>
          <TabsTrigger value="past" className="rounded-md">Past Sessions ({pastSessions.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcomingSessions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {upcomingSessions.map(session => (
                <Card key={session.id} className="hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-headline">Session with {session.counselor}</CardTitle>
                        <CardDescription>{session.date} at {session.time}</CardDescription>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full ${session.type === 'Video Call' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {session.type === 'Video Call' ? <Video className="inline mr-1 h-4 w-4"/> : <MessageSquare className="inline mr-1 h-4 w-4"/>}
                        {session.type}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Status: <span className="text-foreground font-medium">{session.status}</span></p>
                    <p className="text-sm text-muted-foreground mt-1">Your session is scheduled. You will receive a reminder.</p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button variant="outline" size="sm" disabled className="rounded-md">Reschedule (Coming Soon)</Button>
                    <Button variant="destructive" size="sm" disabled className="rounded-md">Cancel (Coming Soon)</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="col-span-full rounded-xl shadow-md">
              <CardContent className="pt-6 text-center">
                <Image src="https://placehold.co/300x200.png" alt="No upcoming sessions" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty student calendar Ghana" />
                <p className="text-muted-foreground">You have no upcoming sessions scheduled.</p>
                <Button asChild className="mt-4 rounded-md">
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
                <Card key={session.id} className="hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <CardHeader>
                     <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-headline">Session with {session.counselor}</CardTitle>
                        <CardDescription>{session.date} at {session.time}</CardDescription>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full ${session.type === 'Video Call' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                         {session.type === 'Video Call' ? <Video className="inline mr-1 h-4 w-4"/> : <MessageSquare className="inline mr-1 h-4 w-4"/>}
                        {session.type}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Status: <span className="text-foreground font-medium">{session.status}</span></p>
                    {session.summary && <p className="mt-2 text-sm bg-secondary/50 p-3 rounded-md">{session.summary}</p>}
                  </CardContent>
                  <CardFooter className="gap-2">
                    {session.notesAvailable && (
                      <Button variant="outline" size="sm" asChild className="rounded-md">
                        <Link href={`/student/sessions/${session.id}/notes`}><FileText className="mr-2 h-4 w-4"/>View Notes</Link>
                      </Button>
                    )}
                    {session.type === 'Video Call' && (
                       <Button variant="outline" size="sm" disabled className="rounded-md">
                         <Video className="mr-2 h-4 w-4"/>Recording (N/A)
                       </Button>
                    )}
                     {session.type === 'Chat Session' && (
                       <Button variant="outline" size="sm" disabled className="rounded-md">
                         <MessageSquare className="mr-2 h-4 w-4"/>Transcript (N/A)
                       </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <Card className="col-span-full rounded-xl shadow-md">
              <CardContent className="pt-6 text-center">
                <Image src="https://placehold.co/300x200.png" alt="No past sessions" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty history illustration Ghana" />
                <p className="text-muted-foreground">You have no past sessions recorded.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
