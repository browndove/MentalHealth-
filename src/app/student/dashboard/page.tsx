
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarPlus, Bot, BookOpen, ClipboardList, UserCircle, Activity, TrendingUp, Smile, Briefcase } from 'lucide-react';
import Image from 'next/image';

// Placeholder data - replace with actual data fetching
const upcomingAppointments = [
  { id: '1', counselor: 'Dr. Emily Carter', date: '2024-08-15', time: '10:00 AM', type: 'Video Call' },
];
const recentNotes = [
  { id: '1', sessionDate: '2024-07-20', summaryPreview: 'Discussed stress management techniques and...' },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-10 container mx-auto px-4 py-8">
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background text-foreground shadow-xl overflow-hidden rounded-xl border-primary/20 border">
        <CardHeader className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Hello, Student Name!</CardTitle> {/* Replace with actual student name */}
              <CardDescription className="text-lg text-muted-foreground mt-1">Welcome to your Accra TechMind portal.</CardDescription>
            </div>
            <Smile size={52} className="text-primary opacity-70 mt-2 sm:mt-0"/>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 p-6 md:p-8">
          <p className="mb-6 text-muted-foreground">Here you can manage your appointments, access resources, and connect with support.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" asChild className="btn-pill bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
              <Link href="/student/appointments/request"><CalendarPlus className="mr-2"/> Request Appointment</Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="btn-pill border-border hover:bg-muted shadow-sm">
              <Link href="/student/ai-assistant"><Bot className="mr-2"/> Chat with AI Assistant</Link>
            </Button>
          </div>
        </CardContent>
         {/* Optional decorative image, ensure it's culturally relevant or abstract */}
         {/* <Image src="https://placehold.co/1200x300.png" alt="Ghanaian student wellness and university life" layout="fill" objectFit="cover" className="opacity-10" data-ai-hint="Ghana student wellness university life abstract" /> */}
      </Card>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-xl transition-shadow rounded-xl border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold"><CalendarPlus className="text-primary" /> Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(apt => (
                <div key={apt.id} className="mb-3 p-4 border rounded-lg bg-secondary/30">
                  <p className="font-semibold text-secondary-foreground">{apt.counselor}</p>
                  <p className="text-sm text-muted-foreground">{apt.date} at {apt.time} ({apt.type})</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground py-2">No upcoming appointments.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="link" asChild className="text-primary p-0 hover:underline"><Link href="/student/sessions">View All Sessions</Link></Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-xl transition-shadow rounded-xl border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold"><ClipboardList className="text-primary" /> Recent Session Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length > 0 ? (
              recentNotes.map(note => (
                <div key={note.id} className="mb-3 p-4 border rounded-lg bg-secondary/30">
                  <p className="font-semibold text-secondary-foreground">Session on {note.sessionDate}</p>
                  <p className="text-sm text-muted-foreground truncate">{note.summaryPreview}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground py-2">No recent session notes available.</p>
            )}
          </CardContent>
           <CardFooter>
            <Button variant="link" asChild className="text-primary p-0 hover:underline"><Link href="/student/sessions">View All Notes</Link></Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-xl transition-shadow rounded-xl border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold"><BookOpen className="text-primary" /> Mental Health Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Explore articles, videos, and tools to support your well-being.</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-sm text-muted-foreground">
                <li>Understanding Stress & Anxiety</li>
                <li>Mindfulness Exercises</li>
                <li>Coping Strategies</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="link" asChild className="text-primary p-0 hover:underline"><Link href="/student/resources">Explore Resources</Link></Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="hover:shadow-xl transition-shadow rounded-xl border">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold"><UserCircle className="text-primary"/> My Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Keep your information up to date for seamless service.</p>
            </CardContent>
            <CardFooter>
                 <Button asChild className="btn-pill btn-card-action">
                    <Link href="/student/profile">Manage Profile</Link>
                 </Button>
            </CardFooter>
        </Card>
        <Card className="hover:shadow-xl transition-shadow rounded-xl border">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold"><Bot className="text-primary" /> AI Quick Help</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Have a quick question? Ama, our AI assistant, is here to help 24/7.</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="btn-pill btn-card-action">
                  <Link href="/student/ai-assistant">Ask Ama</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
       <Card className="mt-6 hover:shadow-xl transition-shadow rounded-xl border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold"><Activity className="text-primary" /> Mood Checker (Coming Soon)</CardTitle>
          <CardDescription>Track your mood and gain insights into your emotional well-being.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">This feature is under development.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
