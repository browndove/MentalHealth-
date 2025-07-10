import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle, MoreHorizontal, Video, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

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
    pending: { border: "border-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/50", text: "text-yellow-700 dark:text-yellow-300", iconColor: "text-yellow-600 dark:text-yellow-400" },
    confirmed: { border: "border-green-500", bg: "bg-green-100 dark:bg-green-900/50", text: "text-green-700 dark:text-green-300", iconColor: "text-green-600 dark:text-green-400" },
    cancelled: { border: "border-red-500", bg: "bg-red-100 dark:bg-red-900/50", text: "text-red-700 dark:text-red-300", iconColor: "text-red-600 dark:text-red-400" },
    completed: { border: "border-blue-500", bg: "bg-blue-100 dark:bg-blue-900/50", text: "text-blue-700 dark:text-blue-300", iconColor: "text-blue-600 dark:text-blue-400" },
  };

  const currentStatusStyle = statusStyles[appointment.status];

  const StatusIcon = {
    pending: AlertTriangle,
    confirmed: CheckCircle,
    cancelled: XCircle,
    completed: CheckCircle,
  }[appointment.status];

  const CommIcon = {
    video: Video,
    chat: MessageSquare,
    'in-person': User
  }[appointment.communicationMode];


  return (
    <Card className={cn(
        'group hover:shadow-xl transition-all duration-300 border border-l-4 flex flex-col',
        currentStatusStyle.border
    )}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={appointment.studentAvatarUrl || `https://placehold.co/40x40.png`} alt={appointment.studentName} data-ai-hint={appointment.studentAiHint || "student photo"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-md font-semibold">{appointment.studentName}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CommIcon className="w-3 h-3" />
                {appointment.communicationMode.charAt(0).toUpperCase() + appointment.communicationMode.slice(1)} Request
              </CardDescription>
            </div>
          </div>
           <div className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${currentStatusStyle.bg} ${currentStatusStyle.text}`}>
              <StatusIcon className={`w-3.5 h-3.5 mr-1.5 ${currentStatusStyle.iconColor}`} />
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 text-sm flex-grow">
        <p className="flex items-center text-muted-foreground"><Calendar className="w-4 h-4 mr-2 text-primary/80" /> {appointment.date}</p>
        <p className="flex items-center text-muted-foreground"><Clock className="w-4 h-4 mr-2 text-primary/80" /> {appointment.time}</p>
        <p className="text-muted-foreground italic line-clamp-2 pt-1">Reason: {appointment.reasonPreview}</p>
      </CardContent>
      {appointment.status === 'pending' && onAccept && onReschedule && onCancel && (
        <CardFooter className="p-4 pt-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onCancel(appointment.id)}>Decline</Button>
          <Button variant="secondary" size="sm" onClick={() => onReschedule(appointment.id)}>Reschedule</Button>
          <Button size="sm" onClick={() => onAccept(appointment.id)}>Accept</Button>
        </CardFooter>
      )}
       {(appointment.status === 'confirmed' || appointment.status === 'completed' || appointment.status === 'cancelled') && (
         <CardFooter className="p-4 pt-2 flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted px-2">
                        <MoreHorizontal className="h-5 w-5"/> Options
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
