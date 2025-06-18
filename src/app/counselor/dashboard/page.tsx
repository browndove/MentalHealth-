
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { StudentOverviewCard } from '@/components/dashboard/StudentOverviewCard';
import { AppointmentCard, type Appointment } from '@/components/dashboard/AppointmentCard';
import { UpcomingSessionCard } from '@/components/dashboard/UpcomingSessionCard';
import { BarChart, Users, CalendarCheck, MessageCircle, Activity, AlertTriangle, Settings } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

// Placeholder data
const assignedStudents = [
  { id: 's1', name: 'Aisha Bello', universityId: 'ATU005678', lastSession: '2024-07-28', nextSession: '2024-08-10', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "female student Ghana profile" },
  { id: 's2', name: 'Kwame Annan', universityId: 'ATU001234', lastSession: '2024-07-25', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "male student Ghana confident"  },
  { id: 's3', name: 'Fatima Ibrahim', universityId: 'ATU009012', nextSession: '2024-08-12', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "Ghanaian student smiling library" },
];

const pendingAppointments: Appointment[] = [
  { id: 'a1', studentName: 'Chinedu Okoro', date: '2024-08-09', time: '03:00 PM', reasonPreview: 'Feeling overwhelmed with coursework and need to talk about stress management.', status: 'pending', communicationMode: 'video', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "male student thinking serious Ghana" },
  { id: 'a2', studentName: 'Amina Yusuf', date: '2024-08-10', time: '11:00 AM', reasonPreview: 'Want to discuss some personal issues affecting my studies.', status: 'pending', communicationMode: 'chat', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "female student glasses thoughtful Ghana" },
];

const upcomingSessions = [
  { id: 'sess1', studentName: 'Aisha Bello', dateTime: 'Tomorrow, 10:00 AM', type: 'video' as const, studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "female student profile formal Ghana" },
  { id: 'sess2', studentName: 'John Mensah', dateTime: 'Aug 18, 2:30 PM', type: 'chat' as const, studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "male student laptop outdoors Ghana" },
];

export default function CounselorDashboardPage() {
  const { toast } = useToast();

  const handleAcceptAppointment = (id: string) => {
    toast({ title: "Appointment Accepted", description: `Appointment ${id} has been confirmed.` });
  };
  const handleRescheduleAppointment = (id: string) => {
     toast({ title: "Reschedule Requested", description: `Reschedule options for ${id} initiated.` });
  };
  const handleCancelAppointment = (id: string) => {
     toast({ title: "Appointment Declined", description: `Appointment ${id} has been declined.`, variant: "destructive" });
  };


  return (
    <div className="space-y-10 container mx-auto px-4 py-8">
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background text-foreground shadow-xl overflow-hidden rounded-xl border-primary/20 border">
        <CardHeader className="relative z-10 p-6 md:p-8">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Welcome, Counselor Name!</CardTitle> {/* Replace with actual counselor name */}
              <CardDescription className="text-lg text-muted-foreground mt-1">Your central hub for managing student sessions at Accra TechMind.</CardDescription>
            </div>
            <Activity size={52} className="text-primary opacity-70 mt-2 sm:mt-0"/>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 p-6 md:p-8">
          <p className="mb-6 text-muted-foreground">Quickly access pending requests, upcoming sessions, and student profiles.</p>
           <Button size="lg" asChild className="btn-pill bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
            <Link href="/counselor/appointments">View Full Schedule</Link>
          </Button>
        </CardContent>
        {/* <Image src="https://placehold.co/1200x300.png" alt="Serene professional counseling space in Ghana" layout="fill" objectFit="cover" className="opacity-10" data-ai-hint="professional counseling office Ghana" /> */}
      </Card>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-1 rounded-xl shadow-lg border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold"><AlertTriangle className="text-primary" /> Pending Appointments ({pendingAppointments.length})</CardTitle>
            <CardDescription>Review and respond to new session requests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto p-4">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map(apt => (
                <AppointmentCard 
                    key={apt.id} 
                    appointment={apt} 
                    onAccept={handleAcceptAppointment}
                    onReschedule={handleRescheduleAppointment}
                    onCancel={handleCancelAppointment}
                />
              ))
            ) : (
              <p className="text-muted-foreground p-4 text-center">No pending appointment requests.</p>
            )}
          </CardContent>
           <CardFooter className="pt-2">
             <Button variant="link" asChild className="text-primary p-0 hover:underline"><Link href="/counselor/appointments">Manage All Pending</Link></Button>
           </CardFooter>
        </Card>

        <Card className="xl:col-span-2 rounded-xl shadow-lg border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold"><CalendarCheck className="text-primary" /> Upcoming Sessions ({upcomingSessions.length})</CardTitle>
             <CardDescription>Prepare for your scheduled student interactions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto p-4">
            {upcomingSessions.length > 0 ? (
               <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {upcomingSessions.map(session => (
                    <UpcomingSessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground p-4 text-center">No upcoming sessions scheduled.</p>
            )}
          </CardContent>
           <CardFooter className="pt-2">
             <Button variant="link" asChild className="text-primary p-0 hover:underline"><Link href="/counselor/appointments?tab=confirmed">View All Confirmed</Link></Button>
           </CardFooter>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2"><Users className="text-primary" /> My Assigned Students ({assignedStudents.length})</h2>
            <Button variant="outline" asChild className="btn-pill border-border hover:bg-muted shadow-sm">
                <Link href="/counselor/students">View All Students</Link>
            </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {assignedStudents.slice(0,3).map(student => ( 
            <StudentOverviewCard key={student.id} student={student} />
          ))}
        </div>
         {assignedStudents.length === 0 && (
            <Card className="rounded-xl shadow-md border"><CardContent className="p-6 text-center text-muted-foreground">No students currently assigned.</CardContent></Card>
        )}
      </div>

       <div className="grid gap-8 md:grid-cols-2">
         <Card className="hover:shadow-xl transition-shadow rounded-xl border">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold"><MessageCircle className="text-primary"/> Session Note Tools</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Efficiently manage and summarize your session notes with AI assistance.</p>
            </CardContent>
            <CardFooter>
                 <Button asChild className="btn-pill btn-card-action">
                    <Link href="/counselor/notes">Access Notes Dashboard</Link>
                 </Button>
            </CardFooter>
        </Card>
        <Card className="hover:shadow-xl transition-shadow rounded-xl border">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold"><BarChart className="text-primary"/> Analytics Overview (Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">View trends in student activity and session effectiveness.</p>
                 <div className="flex items-center justify-center h-24 bg-muted/50 rounded-lg mt-2">
                    <p className="text-muted-foreground">Analytics dashboard is under development.</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="btn-pill btn-card-action" disabled>
                    <Link href="#">View Analytics</Link>
                 </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
