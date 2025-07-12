
import { RequestAppointmentForm } from "@/components/student/RequestAppointmentForm";
import { CalendarPlus } from "lucide-react";

export default function RequestAppointmentPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="mx-auto w-fit bg-primary/10 text-primary p-4 rounded-xl mb-4">
            <CalendarPlus className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Book a Session</h1>
        <p className="text-lg text-muted-foreground mt-2">Find a time that works for you and tell us what's on your mind.</p>
      </div>

      <RequestAppointmentForm />
    </div>
  );
}
