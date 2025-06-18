import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Appointment {
  id: string;
  studentName: string;
  studentAvatarUrl?: string;
  studentAiHint?: string;
  date: string;
  time: string;
  reasonPreview: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  communicationMode: 'video' | 'chat' | 'in-person';
}

interface AppointmentCardProps {
  appointment: Appointment;
  onAccept?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function AppointmentCard({ appointment, onAccept, onReschedule, onCancel }: AppointmentCardProps) {
  const initials = appointment.studentName.split(" ").map(n => n[0]).join("");
  
  const statusStyles = {
    pending: { border: "border-yellow-500", bg: "bg-yellow-500/10", text: "text-yellow-600", iconColor: "text-yellow-500" },
    confirmed: { border: "border-green-500", bg: "bg-green-500/10", text: "text-green-600", iconColor: "text-green-500" },
    cancelled: { border: "border-red-500", bg: "bg-red-500/10", text: "text-red-600", iconColor: "text-red-500" },
    completed: { border: "border-blue-500", bg: "bg-blue-500/10", text: "text-blue-600", iconColor: "text-blue-500" },
  };

  const currentStatusStyle = statusStyles[appointment.status];

  const StatusIcon = {
    pending: AlertTriangle,
    confirmed: CheckCircle,
    cancelled: XCircle,
    completed: CheckCircle,
  }[appointment.status];


  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 rounded-xl border ${currentStatusStyle.border} border-l-4`}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={appointment.studentAvatarUrl || `https://placehold.co/40x40.png`} alt={appointment.studentName} data-ai-hint={appointment.studentAiHint || "student photo"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-md font-semibold">{appointment.studentName}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">{appointment.communicationMode.charAt(0).toUpperCase() + appointment.communicationMode.slice(1)} Request</CardDescription>
            </div>
          </div>
           <div className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${currentStatusStyle.bg} ${currentStatusStyle.text}`}>
              <StatusIcon className={`w-3.5 h-3.5 mr-1.5 ${currentStatusStyle.iconColor}`} />
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 text-sm">
        <p className="flex items-center text-muted-foreground"><Calendar className="w-4 h-4 mr-2 text-primary/80" /> {appointment.date}</p>
        <p className="flex items-center text-muted-foreground"><Clock className="w-4 h-4 mr-2 text-primary/80" /> {appointment.time}</p>
        <p className="text-muted-foreground italic line-clamp-2 pt-1">Reason: {appointment.reasonPreview}</p>
      </CardContent>
      {appointment.status === 'pending' && onAccept && onReschedule && onCancel && (
        <CardFooter className="p-4 pt-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onCancel(appointment.id)} className="btn-pill !px-4 !py-2 border-destructive/50 text-destructive hover:bg-destructive/10">Decline</Button>
          <Button variant="outline" size="sm" onClick={() => onReschedule(appointment.id)} className="btn-pill !px-4 !py-2">Reschedule</Button>
          <Button size="sm" onClick={() => onAccept(appointment.id)} className="btn-pill !px-4 !py-2 bg-primary text-primary-foreground">Accept</Button>
        </CardFooter>
      )}
       {(appointment.status === 'confirmed' || appointment.status === 'completed' || appointment.status === 'cancelled') && (
         <CardFooter className="p-4 pt-2 flex justify-end">
            {/* Example for dropdown actions on confirmed/completed/cancelled. Implement actual actions */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted px-2">
                        <MoreHorizontal className="h-5 w-5"/> Options
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg">
                    <DropdownMenuItem disabled>View Session Details</DropdownMenuItem>
                    {appointment.status === 'confirmed' && <DropdownMenuItem disabled>Start Session Notes</DropdownMenuItem>}
                    {appointment.status === 'completed' && <DropdownMenuItem disabled>View Session Notes</DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu>
         </CardFooter>
       )}
    </Card>
  );
}
