import { RequestAppointmentForm } from "@/components/student/RequestAppointmentForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus } from "lucide-react";

export default function RequestAppointmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CalendarPlus className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline">Request a Counseling Session</h1>
      </div>
      <p className="text-muted-foreground">
        Fill out the form below to request an appointment with one of our counselors. We'll do our best to accommodate your preferences.
      </p>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>New Appointment Request</CardTitle>
          <CardDescription>Please provide as much detail as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <RequestAppointmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
