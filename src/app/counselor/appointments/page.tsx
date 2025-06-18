
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard, type Appointment } from "@/components/dashboard/AppointmentCard";
import { CalendarCheck, AlertTriangle, ListChecks, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const allAppointments: Appointment[] = [
  { id: 'a1', studentName: 'Chinedu Okoro', date: '2024-08-09', time: '03:00 PM', reasonPreview: 'Feeling overwhelmed...', status: 'pending', communicationMode: 'video', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "student photo Ghana" },
  { id: 'a2', studentName: 'Amina Yusuf', date: '2024-08-10', time: '11:00 AM', reasonPreview: 'Personal issues...', status: 'pending', communicationMode: 'chat', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "student picture Ghana" },
  { id: 'a3', studentName: 'Aisha Bello', date: '2024-08-10', time: '10:00 AM', reasonPreview: 'Follow-up session.', status: 'confirmed', communicationMode: 'video', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "student avatar Ghana" },
  { id: 'a4', studentName: 'Kwame Annan', date: '2024-08-07', time: '02:00 PM', reasonPreview: 'Academic stress.', status: 'completed', communicationMode: 'video', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "student portrait Ghana" },
  { id: 'a5', studentName: 'Fatima Ibrahim', date: '2024-08-12', time: '09:00 AM', reasonPreview: 'Anxiety discussion.', status: 'confirmed', communicationMode: 'in-person', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "student image Ghana" },
   { id: 'a6', studentName: 'John Mensah', date: '2024-08-01', time: '01:00 PM', reasonPreview: 'Cancelled by student.', status: 'cancelled', communicationMode: 'chat', studentAvatarUrl: 'https://placehold.co/40x40.png', studentAiHint: "student photo male Ghana" },
];

const pendingAppointments = allAppointments.filter(a => a.status === 'pending');
const confirmedAppointments = allAppointments.filter(a => a.status === 'confirmed');
const completedAppointments = allAppointments.filter(a => a.status === 'completed');


export default function CounselorAppointmentsPage() {
  const { toast } = useToast();

  const handleAccept = (id: string) => {
    toast({ title: "Accepted", description: `Appointment ${id} confirmed.` });
    // Update state/DB
  };
  const handleReschedule = (id: string) => {
    toast({ title: "Reschedule", description: `Initiate reschedule for ${id}.` });
    // Update state/DB
  };
  const handleCancel = (id: string) => {
    toast({ title: "Declined", description: `Appointment ${id} declined.`, variant: "destructive" });
    // Update state/DB
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <CalendarCheck className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline">Manage Appointments</h1>
        </div>
         <Button disabled className="rounded-md"> {/* Or link to a modal for manual creation */}
            <PlusCircle className="mr-2 h-4 w-4"/> Schedule New Appointment
        </Button>
      </div>
      <p className="text-lg text-muted-foreground">
        View, accept, reschedule, or cancel student appointment requests. Keep track of your upcoming and past sessions.
      </p>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 rounded-lg">
          <TabsTrigger value="pending" className="flex items-center gap-2 rounded-md">
            <AlertTriangle className="h-4 w-4"/> Pending ({pendingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-2 rounded-md">
            <CalendarCheck className="h-4 w-4"/> Confirmed ({confirmedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2 rounded-md">
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
            <Card className="rounded-xl shadow-md">
              <CardContent className="pt-6 text-center">
                <Image src="https://placehold.co/300x200.png" alt="No pending requests" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty inbox illustration Ghana" />
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
            <Card className="rounded-xl shadow-md">
              <CardContent className="pt-6 text-center">
                 <Image src="https://placehold.co/300x200.png" alt="No confirmed sessions" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="calendar check illustration Ghana" />
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
            <Card className="rounded-xl shadow-md">
              <CardContent className="pt-6 text-center">
                <Image src="https://placehold.co/300x200.png" alt="No past sessions" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="archive box illustration Ghana" />
                <p className="text-muted-foreground">No completed or cancelled sessions in history yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
