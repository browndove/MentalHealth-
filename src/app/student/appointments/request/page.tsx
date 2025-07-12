
import { RequestAppointmentForm } from "@/components/student/RequestAppointmentForm";
import { CalendarPlus } from "lucide-react";

export default function RequestAppointmentPage() {
  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-primary-foreground/20 p-3 rounded-full">
            <CalendarPlus className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">Book Your Session</h1>
            <p className="text-base text-primary-foreground/90 mt-1 max-w-2xl">Complete the steps below to schedule a confidential appointment with one of our counselors.</p>
          </div>
        </div>
      </div>

      <RequestAppointmentForm />

      {/* Additional sections like FAQ or Crisis Resources can be added here */}
    </div>
  );
}
