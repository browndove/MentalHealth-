import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarPlus, Bot, BookOpen, ClipboardList, UserCircle, Activity, TrendingUp, Smile } from 'lucide-react';
import Image from 'next/image';

// Placeholder data
const upcomingAppointments = [
  { id: '1', counselor: 'Dr. Emily Carter', date: '2024-08-15', time: '10:00 AM', type: 'Video Call' },
];
const recentNotes = [
  { id: '1', sessionDate: '2024-07-20', summaryPreview: 'Discussed stress management techniques and...' },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl overflow-hidden">
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-headline">Hello, Student Name!</CardTitle> {/* Replace with actual student name */}
              <CardDescription className="text-primary-foreground/80 text-lg">Welcome to your Accra TechMind portal.</CardDescription>
            </div>
            <Smile size={64} className="opacity-30"/>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="mb-4">Here you can manage your appointments, access resources, and connect with support.</p>
          <div className="flex gap-4">
            <Button asChild variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/student/appointments/request">Request Appointment</Link>
            </Button>
            <Button asChild variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/student/ai-assistant">Chat with AI Assistant</Link>
            </Button>
          </div>
        </CardContent>
         <Image src="https://placehold.co/1200x300.png" alt="Abstract background" layout="fill" objectFit="cover" className="opacity-20" data-ai-hint="wellness abstract" />
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><CalendarPlus className="text-primary" /> Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(apt => (
                <div key={apt.id} className="mb-3 p-3 border rounded-md bg-secondary/50">
                  <p className="font-semibold">{apt.counselor}</p>
                  <p className="text-sm text-muted-foreground">{apt.date} at {apt.time} ({apt.type})</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming appointments.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="link" asChild className="text-primary p-0"><Link href="/student/sessions">View All Sessions</Link></Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><ClipboardList className="text-primary" /> Recent Session Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length > 0 ? (
              recentNotes.map(note => (
                <div key={note.id} className="mb-3 p-3 border rounded-md bg-secondary/50">
                  <p className="font-semibold">Session on {note.sessionDate}</p>
                  <p className="text-sm text-muted-foreground truncate">{note.summaryPreview}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recent session notes available.</p>
            )}
          </CardContent>
           <CardFooter>
            <Button variant="link" asChild className="text-primary p-0"><Link href="/student/sessions">View All Notes</Link></Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><BookOpen className="text-primary" /> Mental Health Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Explore articles, videos, and tools to support your well-being.</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                <li>Understanding Stress & Anxiety</li>
                <li>Mindfulness Exercises</li>
                <li>Coping Strategies</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="link" asChild className="text-primary p-0"><Link href="/student/resources">Explore Resources</Link></Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><UserCircle className="text-primary"/> My Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Keep your information up to date for seamless service.</p>
            </CardContent>
            <CardFooter>
                 <Button asChild>
                    <Link href="/student/profile">Manage Profile</Link>
                 </Button>
            </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Bot className="text-primary" /> AI Quick Help</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Have a quick question? Our AI assistant is here to help 24/7.</p>
            </CardContent>
            <CardFooter>
                <Button asChild>
                  <Link href="/student/ai-assistant">Ask AI Assistant</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
       <Card className="mt-6 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Activity className="text-primary" /> Mood Checker (Coming Soon)</CardTitle>
          <CardDescription>Track your mood and gain insights into your emotional well-being.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 bg-muted rounded-md">
            <p className="text-muted-foreground">This feature is under development.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
