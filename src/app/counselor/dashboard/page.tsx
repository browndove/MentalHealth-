'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentOverviewCard } from '@/components/dashboard/StudentOverviewCard';
import { AppointmentCard, type Appointment } from '@/components/dashboard/AppointmentCard';
import { UpcomingSessionCard } from '@/components/dashboard/UpcomingSessionCard';
import { BarChart, Users, CalendarCheck, MessageCircle, Activity, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

// Placeholder data
const assignedStudents = [
  { id: 's1', name: 'Aisha Bello', universityId: 'ATU005678', lastSession: '2024-07-28', nextSession: '2024-08-10', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "female student" },
  { id: 's2', name: 'Kwame Annan', universityId: 'ATU001234', lastSession: '2024-07-25', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "male student"  },
  { id: 's3', name: 'Fatima Ibrahim', universityId: 'ATU009012', nextSession: '2024-08-12', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "female student smiling" },
];

const pendingAppointments: Appointment[] = [
  { id: 'a1', studentName: 'Chinedu Okoro', date: '2024-08-09', time: '03:00 PM', reasonPreview: 'Feeling overwhelmed with coursework and need to talk about stress management.', status: 'pending', communicationMode: 'video', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "male student thinking" },
  { id: 'a2', studentName: 'Amina Yusuf', date: '2024-08-10', time: '11:00 AM', reasonPreview: 'Want to discuss some personal issues affecting my studies.', status: 'pending', communicationMode: 'chat', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "female student glasses" },
];

const upcomingSessions = [
  { id: 'sess1', studentName: 'Aisha Bello', dateTime: 'Tomorrow, 10:00 AM', type: 'video' as const, studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "female student" },
  { id: 'sess2', studentName: 'John Mensah', dateTime: 'Aug 18, 2:30 PM', type: 'chat' as const, studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "male student laptop" },
];

export default function CounselorDashboardPage() {
  const { toast } = useToast();

  const handleAcceptAppointment = (id: string) => {
    toast({ title: "Appointment Accepted", description: `Appointment ${id} has been confirmed.` });
    // Logic to update appointment status
  };
  const handleRescheduleAppointment = (id: string) => {
     toast({ title: "Reschedule Requested", description: `Reschedule options for ${id} initiated.` });
    // Logic to handle reschedule
  };
  const handleCancelAppointment = (id: string) => {
     toast({ title: "Appointment Declined", description: `Appointment ${id} has been declined.`, variant: "destructive" });
    // Logic to cancel appointment
  };


  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl overflow-hidden">
        <CardHeader className="relative z-10">
           <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-headline">Welcome, Counselor Name!</CardTitle> {/* Replace with actual counselor name */}
              <CardDescription className="text-primary-foreground/80 text-lg">Your central hub for managing student sessions.</CardDescription>
            </div>
            <Activity size={64} className="opacity-30"/>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="mb-4">Quickly access pending requests, upcoming sessions, and student profiles.</p>
           <Button asChild variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="/counselor/appointments">View Full Schedule</Link>
          </Button>
        </CardContent>
        <Image src="https://placehold.co/1200x300.png" alt="Abstract network" layout="fill" objectFit="cover" className="opacity-20" data-ai-hint="calm office" />
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><AlertTriangle className="text-yellow-500" /> Pending Appointments ({pendingAppointments.length})</CardTitle>
            <CardDescription>Review and respond to new session requests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
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
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><CalendarCheck className="text-primary" /> Upcoming Sessions ({upcomingSessions.length})</CardTitle>
             <CardDescription>Prepare for your scheduled student interactions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
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
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-headline flex items-center gap-2"><Users className="text-primary" /> My Assigned Students ({assignedStudents.length})</h2>
            <Button variant="outline" asChild>
                <Link href="/counselor/students">View All Students</Link>
            </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedStudents.slice(0,3).map(student => ( // Show first 3
            <StudentOverviewCard key={student.id} student={student} />
          ))}
        </div>
         {assignedStudents.length === 0 && (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No students currently assigned.</CardContent></Card>
        )}
      </div>

       <div className="grid gap-6 md:grid-cols-2">
         <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><MessageCircle className="text-primary"/> Session Note Tools</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Efficiently manage and summarize your session notes with AI assistance.</p>
            </CardContent>
            <CardFooter>
                 <Button asChild>
                    <Link href="/counselor/notes">Access Notes Dashboard</Link> {/* Or direct to create new note */}
                 </Button>
            </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><BarChart className="text-primary"/> Analytics Overview (Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">View trends in student activity and session effectiveness.</p>
                 <div className="flex items-center justify-center h-24 bg-muted rounded-md mt-2">
                    <p className="text-muted-foreground">Analytics dashboard is under development.</p>
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
