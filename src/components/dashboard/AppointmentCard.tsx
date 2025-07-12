
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
    Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle, MoreHorizontal, 
    Video, MessageSquare, NotebookPen, UserPlus, Repeat, MessageCircleWarning
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatarUrl?: string;
  studentAiHint?: string;
  date: string; // ISO string like '2024-07-29'
  time: string;
  reasonPreview: string;
  reasonForAppointment: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  communicationMode: 'video' | 'chat' | 'in-person';
  sessionNumber: number | null;
  notesAvailable: boolean;
  duration: number; // in minutes
  lastContact: string; // ISO String
}

interface AppointmentCardProps {
  appointment: Appointment;
  onUpdateStatus?: (id: string, status: 'Confirmed' | 'Cancelled') => void;
}

export function AppointmentCard({ appointment, onUpdateStatus }: AppointmentCardProps) {
  const initials = appointment.studentName?.split(" ").map(n => n[0]).join("") || 'S';
  const lowerCaseStatus = appointment.status?.toLowerCase() as 'pending' | 'confirmed' | 'cancelled' | 'completed' || 'pending';
  
  const statusStyles = {
    pending: { border: "border-yellow-500", text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10" },
    confirmed: { border: "border-green-500", text: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
    cancelled: { border: "border-red-500", text: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
    completed: { border: "border-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  };

  const currentStatusStyle = statusStyles[lowerCaseStatus];
  
  const CommIcon = appointment.communicationMode === 'video' ? Video : appointment.communicationMode === 'chat' ? MessageSquare : User;
  const isInitialSession = appointment.sessionNumber === null || appointment.sessionNumber <= 1;

  const lastContactDate = appointment.lastContact ? parseISO(appointment.lastContact) : null;
  const daysSinceContact = lastContactDate ? differenceInDays(new Date(), lastContactDate) : null;
  const needsFollowUp = daysSinceContact !== null && daysSinceContact > 14;

  return (
    <Card className={cn(
        'group hover:shadow-xl transition-shadow duration-300 border flex flex-col',
        currentStatusStyle.border, 'bg-card shadow-lg'
    )}>
      <CardHeader className="p-4 flex flex-row items-start justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={appointment.studentAvatarUrl || ''} alt={appointment.studentName} data-ai-hint={appointment.studentAiHint || "student photo"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <CardTitle className="text-md font-semibold truncate">{appointment.studentName}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
                {isInitialSession ? 
                  <><UserPlus className="w-3 h-3 text-accent"/> Initial Session</> : 
                  <><Repeat className="w-3 h-3 text-primary"/> Session #{appointment.sessionNumber}</>
                }
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={cn("capitalize text-xs font-medium", currentStatusStyle.text, currentStatusStyle.border)}>
              {appointment.status}
          </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3 text-sm flex-grow">
        <div className="flex items-center text-foreground font-semibold">
          <Calendar className="w-4 h-4 mr-2 text-primary/80" /> 
          {format(parseISO(appointment.date), 'EEE, MMM dd, yyyy')} at {appointment.time}
        </div>
        
        <div className="flex justify-between items-center text-muted-foreground">
          <div className="flex items-center"><CommIcon className="w-4 h-4 mr-2 text-primary/80" /> {appointment.communicationMode.charAt(0).toUpperCase() + appointment.communicationMode.slice(1)}</div>
          <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-primary/80" /> {appointment.duration} min</div>
        </div>

        <p className="text-muted-foreground italic line-clamp-2 pt-2 border-t border-dashed mt-2">
          &quot;{appointment.reasonForAppointment}&quot;
        </p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
            {needsFollowUp && (
              <div className="flex items-center text-xs text-red-600 dark:text-red-400 font-medium">
                <MessageCircleWarning className="w-3.5 h-3.5 mr-1.5" />Follow-up needed ({daysSinceContact} days)
              </div>
            )}
            {appointment.status === 'Completed' && !appointment.notesAvailable && (
                 <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                    <NotebookPen className="w-3.5 h-3.5 mr-1.5" /> Notes Pending
                 </div>
            )}
        </div>

      </CardContent>

      <CardFooter className="p-3 pt-2 bg-muted/50 border-t flex justify-end gap-2">
        {appointment.status === 'Pending' && onUpdateStatus && (
          <>
            <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(appointment.id, 'Cancelled')}>Decline</Button>
            <Button size="sm" onClick={() => onUpdateStatus(appointment.id, 'Confirmed')}>
              <CheckCircle className="mr-2 h-4 w-4" /> Accept
            </Button>
          </>
        )}
        {appointment.status === 'Confirmed' && (
           <>
              <Button variant="outline" size="sm" asChild>
                  <Link href={`/counselor/sessions/${appointment.id}/notes`}><NotebookPen className="mr-2 h-4 w-4"/>Prepare</Link>
              </Button>
              <Button size="sm" asChild>
                  <Link href={`/session/${appointment.id}/video`}><Video className="mr-2 h-4 w-4"/>Join Call</Link>
              </Button>
           </>
        )}
        {(appointment.status === 'Completed' || appointment.status === 'Cancelled') && (
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted px-2">
                      <MoreHorizontal className="h-5 w-5"/> Options
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/counselor/students/${appointment.studentId}/profile`}>
                      <User className="mr-2 h-4 w-4" /> View Student Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {appointment.status === 'Completed' && (
                    <DropdownMenuItem asChild>
                      <Link href={`/counselor/sessions/${appointment.id}/notes`}>
                        <NotebookPen className="mr-2 h-4 w-4" /> View/Edit Note
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {appointment.status === 'Cancelled' && (
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" /> Send Follow-up
                    </DropdownMenuItem>
                  )}
              </DropdownMenuContent>
           </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
}
