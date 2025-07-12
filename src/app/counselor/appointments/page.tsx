
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentCard, type Appointment } from "@/components/dashboard/AppointmentCard";
import { 
  CalendarCheck, 
  AlertTriangle, 
  ListChecks, 
  PlusCircle, 
  Loader2, 
  Users, 
  Clock,
  NotebookPen,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getCounselorAppointments, updateAppointmentStatus } from "@/lib/actions";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentsChart } from "@/components/counselor/AppointmentsChart";
import { Badge } from "@/components/ui/badge";

export default function CounselorAppointmentsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'History'>('All');

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getCounselorAppointments(user.uid);
      if (result.error) throw new Error(result.error);
      const appointments = result.data?.map(a => ({ ...a, id: a.id! })) as Appointment[] || [];
      setAllAppointments(appointments);
    } catch (err: any) {
      setError(err.message);
      toast({ variant: "destructive", title: "Failed to load appointments", description: err.message });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleUpdateStatus = async (id: string, newStatus: 'Confirmed' | 'Cancelled') => {
    const originalAppointments = [...allAppointments];
    setAllAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    
    const result = await updateAppointmentStatus(id, newStatus.toLowerCase() as 'confirmed' | 'cancelled');
    
    if (result.success) {
      toast({ title: "Status Updated", description: `Appointment has been ${newStatus.toLowerCase()}.` });
      await fetchData(); // Refresh data to be sure
    } else {
      toast({ title: "Error", description: result.error, variant: 'destructive' });
      setAllAppointments(originalAppointments); // Revert on error
    }
  };
  
  const filteredAppointments = useMemo(() => {
    if (filter === 'All') return allAppointments;
    if (filter === 'Pending') return allAppointments.filter(a => a.status === 'Pending');
    if (filter === 'Confirmed') return allAppointments.filter(a => a.status === 'Confirmed');
    if (filter === 'History') return allAppointments.filter(a => ['Completed', 'Cancelled'].includes(a.status));
    return [];
  }, [allAppointments, filter]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      todaysAppointments: allAppointments.filter(a => a.date === today && a.status === 'Confirmed').length,
      pendingAppointments: allAppointments.filter(a => a.status === 'Pending').length,
      confirmedAppointments: allAppointments.filter(a => a.status === 'Confirmed').length,
      needsNotesCount: allAppointments.filter(a => a.status === 'Completed' && !a.notesAvailable).length,
    }
  }, [allAppointments]);

  const renderSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col shadow-sm border-dashed">
                <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3 flex-grow">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40" />
                </CardContent>
                <CardFooter className="p-4 pt-2 flex justify-end gap-2">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                </CardFooter>
            </Card>
        ))}
    </div>
  );
  
  const renderEmptyState = (title: string, description: string) => (
      <Card className="col-span-full border-dashed mt-6">
        <CardContent className="py-12 text-center flex flex-col items-center justify-center">
            <div className="bg-secondary p-6 rounded-full mb-6">
                <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">{description}</p>
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Appointments</h1>
          <p className="text-lg text-muted-foreground">
              Review, confirm, and track all your student sessions.
          </p>
        </div>
         <Button asChild size="lg">
            <Link href="/counselor/notes">
              <PlusCircle className="mr-2 h-5 w-5"/> New Session Note
            </Link>
        </Button>
      </div>
      
      {error && (
         <Card className="bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle/> Error Loading Data</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive-foreground">{error}</p>
            </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Today's Sessions</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : stats.todaysAppointments}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Requests</CardTitle><AlertTriangle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : stats.pendingAppointments}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Confirmed Sessions</CardTitle><CalendarCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : stats.confirmedAppointments}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Needs Notes</CardTitle><NotebookPen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : stats.needsNotesCount}</div></CardContent></Card>
      </div>

      <div className="flex items-center gap-2">
          {(['All', 'Pending', 'Confirmed', 'History'] as const).map(f => (
              <Button key={f} variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)}>
                  {f}
                  {f === 'Pending' && <Badge variant="secondary" className="ml-2">{stats.pendingAppointments}</Badge>}
              </Button>
          ))}
      </div>
      
      {loading ? renderSkeleton() : filteredAppointments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAppointments.map(apt => (
            <AppointmentCard key={apt.id} appointment={apt} onUpdateStatus={handleUpdateStatus}/>
          ))}
        </div>
      ) : (
        !error && renderEmptyState("No Appointments Found", `There are no appointments matching the "${filter}" filter.`)
      )}
    </div>
  );
}
