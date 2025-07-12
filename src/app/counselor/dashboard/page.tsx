
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { StudentOverviewCard } from '@/components/dashboard/StudentOverviewCard';
import { AppointmentCard, type Appointment } from '@/components/dashboard/AppointmentCard';
import { UpcomingSessionCard } from '@/components/dashboard/UpcomingSessionCard';
import { BarChart, Users, CalendarCheck, MessageCircle, Activity, AlertTriangle, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getCounselorAppointments, getAssignedStudents } from '@/lib/actions';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

type Student = {
  id: string;
  name: string;
  universityId: string;
  lastSession?: string;
  nextSession?: string;
  avatarUrl?: string;
  aiHint?: string;
};

export default function CounselorDashboardPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]); // Using any for simplicity from appointment data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [appointmentsResult, studentsResult] = await Promise.all([
        getCounselorAppointments(user.uid),
        getAssignedStudents(user.uid)
      ]);

      if (appointmentsResult.error) throw new Error(appointmentsResult.error);
      if (studentsResult.error) throw new Error(studentsResult.error);

      const allAppointments = appointmentsResult.data || [];
      const students = studentsResult.data || [];
      
      setAssignedStudents(students);
      setPendingAppointments(allAppointments.filter(a => a.status === 'Pending').map(a => ({...a, id: a.id! })) as Appointment[]);
      setUpcomingSessions(allAppointments.filter(a => a.status === 'Confirmed'));

    } catch (err: any) {
      setError(err.message);
      toast({ variant: 'destructive', title: "Failed to load dashboard", description: err.message });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAcceptAppointment = (id: string) => {
    toast({ title: "Appointment Accepted", description: `Appointment ${id} has been confirmed.` });
    fetchData(); // Refresh data
  };
  const handleRescheduleAppointment = (id: string) => {
     toast({ title: "Reschedule Requested", description: `Reschedule options for ${id} initiated.` });
  };
  const handleCancelAppointment = (id: string) => {
     toast({ title: "Appointment Declined", description: `Appointment ${id} has been declined.`, variant: "destructive" });
     fetchData(); // Refresh data
  };

  if (loading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }

  return (
    <div className="space-y-10 container mx-auto px-4 py-8">
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background text-foreground shadow-lg overflow-hidden border-primary/20 border">
        <CardHeader className="relative z-10 p-6 md:p-8">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Welcome, {user?.fullName || 'Counselor'}!</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-1">Your central hub for managing student sessions at Accra TechMind.</CardDescription>
            </div>
            <Activity size={52} className="text-primary opacity-70 mt-2 sm:mt-0"/>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 p-6 md:p-8">
          <p className="mb-6 text-muted-foreground">Quickly access pending requests, upcoming sessions, and student profiles.</p>
           <Button size="lg" asChild>
            <Link href="/counselor/appointments">View Full Schedule</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-1 shadow-md border">
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

        <Card className="xl:col-span-2 shadow-md border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold"><CalendarCheck className="text-primary" /> Upcoming Sessions ({upcomingSessions.length})</CardTitle>
             <CardDescription>Prepare for your scheduled student interactions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto p-4">
            {upcomingSessions.length > 0 ? (
               <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {upcomingSessions.map(session => (
                    <UpcomingSessionCard key={session.id} session={{
                      id: session.id,
                      studentName: session.studentName,
                      dateTime: `${new Date(session.date).toLocaleDateString()} at ${session.time}`,
                      type: session.communicationMode,
                      studentAvatarUrl: session.studentAvatarUrl
                    }} />
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
            <Button variant="outline" asChild className="border-border hover:bg-muted shadow-sm">
                <Link href="/counselor/students">View All Students</Link>
            </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {assignedStudents.slice(0,3).map(student => ( 
            <StudentOverviewCard key={student.id} student={student} />
          ))}
        </div>
         {assignedStudents.length === 0 && (
            <Card className="shadow-md border"><CardContent className="p-6 text-center text-muted-foreground">No students currently assigned.</CardContent></Card>
        )}
      </div>

       <div className="grid gap-8 md:grid-cols-2">
         <Card className="hover:shadow-xl transition-shadow border">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold"><MessageCircle className="text-primary"/> Session Note Tools</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Efficiently manage and summarize your session notes with AI assistance.</p>
            </CardContent>
            <CardFooter>
                 <Button asChild>
                    <Link href="/counselor/notes">Access Notes Dashboard</Link>
                 </Button>
            </CardFooter>
        </Card>
        <Card className="hover:shadow-xl transition-shadow border">
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
                <Button asChild disabled>
                    <Link href="#">View Analytics</Link>
                 </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
