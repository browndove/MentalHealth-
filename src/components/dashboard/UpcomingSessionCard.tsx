import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Video, MessageSquare, Clock, User } from 'lucide-react';

interface UpcomingSessionCardProps {
  session: {
    id: string;
    studentName: string;
    studentAvatarUrl?: string;
    studentAiHint?: string;
    dateTime: string; // e.g., "Tomorrow at 10:00 AM" or "Aug 15, 2:00 PM"
    type: 'video' | 'chat' | 'in-person';
  };
}

export function UpcomingSessionCard({ session }: UpcomingSessionCardProps) {
  const initials = session.studentName.split(" ").map(n => n[0]).join("");
  const Icon = session.type === 'video' ? Video : session.type === 'chat' ? MessageSquare : User;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                <AvatarImage src={session.studentAvatarUrl || `https://placehold.co/40x40.png`} alt={session.studentName} data-ai-hint={session.studentAiHint || "student profile"}/>
                <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                <CardTitle className="text-md font-headline">{session.studentName}</CardTitle>
                <CardDescription className="text-xs flex items-center">
                    <Icon className="w-3 h-3 mr-1 text-primary" /> {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Session
                </CardDescription>
                </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
                 <Link href={`/session/${session.id}/video`}>Join</Link>
            </Button>
         </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground flex items-center">
            <Clock className="w-4 h-4 mr-2 text-primary" /> {session.dateTime}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/counselor/students/${session.id}/profile`}>Student Profile</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/counselor/sessions/${session.id}/notes`}>Prepare Notes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
