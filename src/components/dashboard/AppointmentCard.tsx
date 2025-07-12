
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle, MoreHorizontal, Video, MessageSquare, ListVideo } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import Link from 'next/link';

export interface Appointment {
  id: string;
  studentName: string;
  studentAvatarUrl?: string;
  studentAiHint?: string;
  date: string;
  time: string;
  reasonPreview: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  communicationMode: 'video' | 'chat' | 'in-person';
}

interface AppointmentCardProps {
  appointment: Appointment;
  onAccept?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function AppointmentCard({ appointment, onAccept, onCancel }: AppointmentCardProps) {
  const initials = appointment.studentName?.split(" ").map(n => n[0]).join("") || 'S';
  const lowerCaseStatus = appointment.status?.toLowerCase() as 'pending' | 'confirmed' | 'cancelled' | 'completed' || 'pending';
  
  const statusStyles = {
    pending: { border: "border-yellow-500", icon: AlertTriangle, text: "text-yellow-600 dark:text-yellow-400" },
    confirmed: { border: "border-green-500", icon: CheckCircle, text: "text-green-600 dark:text-green-400" },
    cancelled: { border: "border-red-500", icon: XCircle, text: "text-red-600 dark:text-red-400" },
    completed: { border: "border-blue-500", icon: CheckCircle, text: "text-blue-600 dark:text-blue-400" },
  };

  const currentStatusStyle = statusStyles[lowerCaseStatus];
  const StatusIcon = currentStatusStyle.icon;

  const CommIcon = {
    video: Video,
    chat: MessageSquare,
    'in-person': User
  }[appointment.communicationMode || 'video'];


  return (
    <Card className={cn(
        'group hover:shadow-xl transition-shadow duration-300 border-l-4 flex flex-col',
        currentStatusStyle.border
    )}>
      <CardHeader className="p-4 flex flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={appointment.studentAvatarUrl || `https://placehold.co/40x40.png`} alt={appointment.studentName} data-ai-hint={appointment.studentAiHint || "student photo"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-md font-semibold">{appointment.studentName}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CommIcon className="w-3 h-3" />
                {appointment.communicationMode ? (appointment.communicationMode.charAt(0).toUpperCase() + appointment.communicationMode.slice(1)) : 'Session'} Request
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={cn("capitalize", currentStatusStyle.text, currentStatusStyle.border)}>
              <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
              {appointment.status}
          </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 text-sm flex-grow">
        <div className="flex items-center text-foreground font-medium"><Calendar className="w-4 h-4 mr-2 text-primary/80" /> {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div className="flex items-center text-muted-foreground"><Clock className="w-4 h-4 mr-2 text-primary/80" /> {appointment.time}</div>
        <p className="text-muted-foreground italic line-clamp-2 pt-1">Reason: &quot;{appointment.reasonPreview}&quot;</p>
      </CardContent>
      {appointment.status === 'Pending' && onAccept && onCancel && (
        <CardFooter className="p-4 pt-2 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onCancel(appointment.id)}>Decline</Button>
          <Button size="sm" onClick={() => onAccept(appointment.id)}>
            <CheckCircle className="mr-2 h-4 w-4" /> Accept
          </Button>
        </CardFooter>
      )}
       {appointment.status === 'Confirmed' && (
         <CardFooter className="p-4 pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={`/counselor/sessions/${appointment.id}/notes`}><ListVideo className="mr-2 h-4 w-4"/>Prepare</Link>
            </Button>
            <Button size="sm" asChild>
                <Link href={`/session/${appointment.id}/video`}><Video className="mr-2 h-4 w-4"/>Join Call</Link>
            </Button>
         </CardFooter>
       )}
       {(appointment.status === 'Completed' || appointment.status === 'Cancelled') && (
         <CardFooter className="p-4 pt-2 flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted px-2">
                        <MoreHorizontal className="h-5 w-5"/> Options
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>View Session Details</DropdownMenuItem>
                    {appointment.status === 'Completed' && <DropdownMenuItem disabled>View Session Notes</DropdownMenuItem>}
                    {appointment.status === 'Cancelled' && <DropdownMenuItem disabled>Send Follow-up</DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu>
         </CardFooter>
       )}
    </Card>
  );
}
