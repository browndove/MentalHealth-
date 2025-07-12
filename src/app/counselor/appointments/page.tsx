
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard, type Appointment } from "@/components/dashboard/AppointmentCard";
import { CalendarCheck, AlertTriangle, ListChecks, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getCounselorAppointments, updateAppointmentStatus } from "@/lib/actions";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';

export default function CounselorAppointmentsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
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
      setAllAppointments(result.data?.map(a => ({ ...a, id: a.id! })) as Appointment[] || []);
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

  const handleAccept = async (id: string) => {
    const result = await updateAppointmentStatus(id, 'confirmed');
    if (result.success) {
      toast({ title: "Accepted", description: `Appointment ${id} confirmed.` });
      fetchData(); // Refresh data
    } else {
      toast({ title: "Error", description: result.error, variant: 'destructive' });
    }
  };
  
  const handleReschedule = (id: string) => {
    toast({ title: "Reschedule", description: `Initiate reschedule for ${id}. (Not implemented)` });
  };
  
  const handleCancel = async (id: string) => {
    const result = await updateAppointmentStatus(id, 'cancelled');
    if (result.success) {
      toast({ title: "Declined", description: `Appointment ${id} declined.`, variant: "destructive" });
      fetchData(); // Refresh data
    } else {
      toast({ title: "Error", description: result.error, variant: 'destructive' });
    }
  };
  
  const pendingAppointments = allAppointments.filter(a => a.status === 'Pending');
  const confirmedAppointments = allAppointments.filter(a => a.status === 'Confirmed');
  const completedAppointments = allAppointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  if (loading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <CalendarCheck className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline">Manage Appointments</h1>
        </div>
         <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4"/> Schedule New Appointment
        </Button>
      </div>
      <p className="text-lg text-muted-foreground">
        View, accept, reschedule, or cancel student appointment requests. Keep track of your upcoming and past sessions.
      </p>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4"/> Pending ({pendingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4"/> Confirmed ({confirmedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4"/> History ({completedAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingAppointments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} onAccept={handleAccept} onReschedule={handleReschedule} onCancel={handleCancel}/>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Image src="https://placehold.co/300x200.png" alt="No pending requests" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty inbox illustration" />
                <p className="text-muted-foreground">No pending appointment requests at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="mt-6">
          {confirmedAppointments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {confirmedAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                 <Image src="https://placehold.co/300x200.png" alt="No confirmed sessions" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="calendar check illustration" />
                <p className="text-muted-foreground">No sessions confirmed yet. Check pending requests.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedAppointments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Image src="https://placehold.co/300x200.png" alt="No past sessions" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="archive box illustration" />
                <p className="text-muted-foreground">No completed or cancelled sessions in history yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
