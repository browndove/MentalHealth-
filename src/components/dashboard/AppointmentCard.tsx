import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export interface Appointment {
  id: string;
  studentName: string;
  studentAvatarUrl?: string;
  studentAiHint?: string;
  date: string;
  time: string;
  reasonPreview: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; // More statuses could be added
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
  
  const statusColors = {
    pending: "border-yellow-500 bg-yellow-50 text-yellow-700",
    confirmed: "border-green-500 bg-green-50 text-green-700",
    cancelled: "border-red-500 bg-red-50 text-red-700",
    completed: "border-blue-500 bg-blue-50 text-blue-700",
  };

  const StatusIcon = {
    pending: AlertTriangle,
    confirmed: CheckCircle,
    cancelled: XCircle,
    completed: CheckCircle,
  }[appointment.status];


  return (
    <Card className={`hover:shadow-lg transition-shadow border-l-4 ${statusColors[appointment.status]}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={appointment.studentAvatarUrl || `https://placehold.co/40x40.png`} alt={appointment.studentName} data-ai-hint={appointment.studentAiHint || "student photo"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-md font-headline">{appointment.studentName}</CardTitle>
              <CardDescription className="text-xs">{appointment.communicationMode.charAt(0).toUpperCase() + appointment.communicationMode.slice(1)} Request</CardDescription>
            </div>
          </div>
           <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${statusColors[appointment.status].replace('border-l-4', '')}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary" /> {appointment.date}</p>
        <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-primary" /> {appointment.time}</p>
        <p className="text-muted-foreground italic line-clamp-2">Reason: {appointment.reasonPreview}</p>
      </CardContent>
      {appointment.status === 'pending' && onAccept && onReschedule && onCancel && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onCancel(appointment.id)}>Decline</Button>
          <Button variant="outline" size="sm" onClick={() => onReschedule(appointment.id)}>Reschedule</Button>
          <Button size="sm" onClick={() => onAccept(appointment.id)}>Accept</Button>
        </CardFooter>
      )}
       {(appointment.status === 'confirmed' || appointment.status === 'completed') && (
         <CardFooter>
            <Button variant="link" size="sm" className="text-primary p-0">View Details</Button>
         </CardFooter>
       )}
    </Card>
  );
}
