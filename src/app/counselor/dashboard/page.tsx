
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  BarChart, Users, CalendarCheck, MessageCircle, Activity, AlertTriangle, 
  Settings, Loader2, Plus, Calendar, Clock, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getCounselorAppointments, getAssignedStudents } from '@/lib/actions';
import { useEffect, useState, useCallback } from 'react';
import type { Appointment } from "@/components/dashboard/AppointmentCard";
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AppointmentsChart } from '@/components/counselor/AppointmentsChart';

type Student = {
  id: string;
  name: string;
  universityId: string;
  avatarUrl?: string;
  aiHint?: string;
};

export default function CounselorDashboardPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

      setAppointments(appointmentsResult.data?.map(a => ({...a, id: a.id! })) as Appointment[] || []);
      setAssignedStudents(studentsResult.data || []);
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

  const pendingAppointments = appointments.filter(a => a.status === 'Pending');
  const upcomingSessions = appointments.filter(a => a.status === 'Confirmed' && new Date(a.date) >= new Date());
  const nextSession = upcomingSessions.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const StatCard = ({ title, value, icon: Icon, change, changeType, href, bgColorClass }: { 
    title: string, 
    value: string | number, 
    icon: React.ElementType, 
    change?: string, 
    changeType?: 'increase' | 'decrease' | 'on-discuss',
    href?: string,
    bgColorClass?: string
  }) => (
    <Card className={cn("shadow-sm hover:shadow-lg transition-shadow", bgColorClass)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center text-muted-foreground hover:text-primary cursor-pointer">
              <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value}</div>
        {change && (
          <p className={cn(
            "text-xs text-muted-foreground mt-2 flex items-center gap-1",
            changeType === 'increase' && 'text-emerald-500',
            changeType === 'decrease' && 'text-red-500'
          )}>
            <Activity className="h-3 w-3"/>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-96" />
          <div className="space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-44" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <Card className="bg-destructive/10 border-destructive text-center p-8">
      <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-bold text-destructive-foreground">Dashboard Error</h3>
      <p className="text-destructive-foreground/90">{error}</p>
      <Button variant="destructive" onClick={fetchData} className="mt-4">Try Again</Button>
    </Card>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <Button asChild>
          <Link href="/counselor/appointments">
            <Plus className="mr-2 h-4 w-4" /> View All Appointments
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value={assignedStudents.length} 
          icon={Users} 
          change={`${Math.floor(Math.random() * 5 + 1)} new this month`} 
          changeType="increase" 
          bgColorClass="bg-primary/10 border-primary/20"
        />
        <StatCard title="Upcoming Sessions" value={upcomingSessions.length} icon={Calendar} change={`${Math.floor(Math.random() * 3 + 1)} this week`} />
        <StatCard title="Pending Requests" value={pendingAppointments.length} icon={AlertTriangle} change="On Discuss" changeType="on-discuss" />
        <StatCard title="Completed This Month" value={appointments.filter(a => a.status === 'Completed').length} icon={CalendarCheck} change="On track" />
      </div>

      {/* Bento Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project Analytics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Session Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[300px]">
            <AppointmentsChart data={appointments} />
          </CardContent>
        </Card>
        
        {/* Reminders */}
        {nextSession ? (
          <Card>
            <CardHeader>
              <CardTitle>Next Session Reminder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{nextSession.studentName}</p>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" /> {format(parseISO(nextSession.date), 'EEE, MMM dd, yyyy')}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4" /> {nextSession.time}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/session/${nextSession.id}/video`}>Start Meeting</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader><CardTitle>No Upcoming Sessions</CardTitle></CardHeader>
            <CardContent className="text-center text-muted-foreground py-10">
              <CalendarCheck className="h-10 w-10 mx-auto mb-2"/>
              <p>Your schedule is clear!</p>
            </CardContent>
          </Card>
        )}

        {/* Team Collaboration */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assigned Students</CardTitle>
            <Button variant="outline" size="sm" asChild><Link href="/counselor/students"><Plus className="mr-2 h-4 w-4"/>View All</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedStudents.slice(0, 4).map(student => (
                <div key={student.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint={student.aiHint} />
                    <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {student.universityId}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                     <Link href={`/counselor/students/${student.id}/profile`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Project Progress */}
        <Card className="flex flex-col items-center justify-center text-center">
            <CardHeader><CardTitle>Notes Completion</CardTitle></CardHeader>
            <CardContent>
                <div className="relative h-40 w-40">
                    <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                        <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--primary))" strokeWidth="12" strokeDasharray="339.292" strokeDashoffset={339.292 * (1 - 0.41)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">41%</span>
                        <span className="text-sm text-muted-foreground">Completed</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2">
                 <p className="text-xs text-muted-foreground">12 of 29 session notes completed.</p>
                 <Button variant="secondary" size="sm" asChild><Link href="/counselor/notes">Manage Notes</Link></Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
