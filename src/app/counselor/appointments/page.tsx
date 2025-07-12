
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard, type Appointment } from "@/components/dashboard/AppointmentCard";
import { 
  CalendarCheck, 
  AlertTriangle, 
  ListChecks, 
  PlusCircle, 
  Loader2, 
  Users, 
  Clock,
  NotebookPen
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getCounselorAppointments, updateAppointmentStatus } from "@/lib/actions";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CounselorAppointmentsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // Optimistically update UI
    setAllAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    
    const result = await updateAppointmentStatus(id, newStatus.toLowerCase() as 'confirmed' | 'cancelled');
    
    if (result.success) {
      toast({ title: "Status Updated", description: `Appointment has been ${newStatus.toLowerCase()}.` });
      fetchData(); // Refresh data to be sure
    } else {
      toast({ title: "Error", description: result.error, variant: 'destructive' });
      setAllAppointments(originalAppointments); // Revert on error
    }
  };

  const {
    pendingAppointments,
    confirmedAppointments,
    historyAppointments,
    todaysAppointments,
    pendingNotesCount
  } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      pendingAppointments: allAppointments.filter(a => a.status === 'Pending'),
      confirmedAppointments: allAppointments.filter(a => a.status === 'Confirmed'),
      historyAppointments: allAppointments.filter(a => ['Completed', 'Cancelled'].includes(a.status)),
      todaysAppointments: allAppointments.filter(a => a.date === today && a.status === 'Confirmed'),
      pendingNotesCount: allAppointments.filter(a => a.status === 'Completed' && !a.notesAvailable).length
    };
  }, [allAppointments]);

  const stats = [
    { name: "Today's Sessions", value: loading ? '...' : todaysAppointments.length, icon: Clock },
    { name: "Pending Requests", value: loading ? '...' : pendingAppointments.length, icon: AlertTriangle },
    { name: "Total Confirmed", value: loading ? '...' : confirmedAppointments.length, icon: CalendarCheck },
    { name: "Needs Notes", value: loading ? '...' : pendingNotesCount, icon: NotebookPen },
  ];

  const renderSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col shadow-md">
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
                    <Skeleton className="h-8 w-full mt-2" />
                </CardContent>
                <CardFooter className="p-4 pt-2 flex justify-end gap-2">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                </CardFooter>
            </Card>
        ))}
    </div>
  );
  
  const renderEmptyState = (title: string, description: string, imageHint: string) => (
      <Card className="col-span-full">
        <CardContent className="py-12 text-center flex flex-col items-center justify-center">
            <Image 
                src={`https://placehold.co/300x200.png`} 
                alt={title} 
                width={250} 
                height={167} 
                className="mx-auto mb-6 rounded-lg shadow-sm" 
                data-ai-hint={imageHint} 
            />
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">{description}</p>
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <CalendarCheck className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold font-headline">Manage Appointments</h1>
             <p className="text-lg text-muted-foreground">
                Review, confirm, and track all your student sessions.
            </p>
          </div>
        </div>
         <Button asChild>
            <Link href="/counselor/notes">
              <PlusCircle className="mr-2 h-4 w-4"/> New Session Note
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

      {/* Stats Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="pending">
            <AlertTriangle className="mr-2 h-4 w-4"/> Pending ({loading ? '...' : pendingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            <CalendarCheck className="mr-2 h-4 w-4"/> Confirmed ({loading ? '...' : confirmedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <ListChecks className="mr-2 h-4 w-4"/> History ({loading ? '...' : historyAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? renderSkeleton() : pendingAppointments.length > 0 ? (
                pendingAppointments.map(apt => (
                  <AppointmentCard key={apt.id} appointment={apt} onUpdateStatus={handleUpdateStatus}/>
                ))
            ) : (
              renderEmptyState("All Caught Up!", "There are no pending appointment requests at the moment. Good job!", "empty inbox illustration")
            )}
          </div>
        </TabsContent>

        <TabsContent value="confirmed" className="mt-6">
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? renderSkeleton() : confirmedAppointments.length > 0 ? (
                confirmedAppointments.map(apt => (
                  <AppointmentCard key={apt.id} appointment={apt} onUpdateStatus={handleUpdateStatus} />
                ))
            ) : (
              renderEmptyState("No Confirmed Sessions", "Once you accept a pending request, it will appear here.", "calendar check illustration")
            )}
           </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? renderSkeleton() : historyAppointments.length > 0 ? (
                historyAppointments.map(apt => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))
            ) : (
              renderEmptyState("No Session History", "Completed and cancelled appointments will be logged here for your records.", "archive box illustration")
            )}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
