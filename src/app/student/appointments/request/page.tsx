import { RequestAppointmentForm } from "@/components/student/RequestAppointmentForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus } from "lucide-react";

export default function RequestAppointmentPage() {
  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <CalendarPlus className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-headline">Request a Session</h1>
            <p className="text-lg text-muted-foreground mt-1">Find a time that works for you.</p>
          </div>
        </div>
      </div>

      <Card className="shadow-lg border-border/60">
        <CardHeader>
          <CardTitle>New Appointment Details</CardTitle>
          <CardDescription>
            Fill out the form below to request a new counseling session. We'll do our best to accommodate your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestAppointmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
