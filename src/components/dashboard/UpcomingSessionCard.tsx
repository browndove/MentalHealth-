import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Video, MessageSquare, Clock, User as PersonIcon, Info } from 'lucide-react';

interface UpcomingSessionCardProps {
  session: {
    id: string;
    studentName: string;
    studentAvatarUrl?: string;
    studentAiHint?: string;
    dateTime: string; 
    type: 'video' | 'chat' | 'in-person';
  };
}

export function UpcomingSessionCard({ session }: UpcomingSessionCardProps) {
  const initials = session.studentName.split(" ").map(n => n[0]).join("");
  const Icon = session.type === 'video' ? Video : session.type === 'chat' ? MessageSquare : PersonIcon;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 bg-card">
      <CardHeader className="p-4">
         <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border border-primary/30">
                <AvatarImage src={session.studentAvatarUrl || `https://placehold.co/40x40.png`} alt={session.studentName} data-ai-hint={session.studentAiHint || "student profile Ghana"}/>
                <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                <CardTitle className="text-md font-semibold text-card-foreground">{session.studentName}</CardTitle>
                <CardDescription className="text-xs flex items-center text-muted-foreground">
                    <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/90" /> {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Session
                </CardDescription>
                </div>
            </div>
            <Button variant="default" size="sm" asChild>
                 <Link href={`/session/${session.id}/${session.type === 'video' ? 'video' : 'chat'}`}>Join</Link>
            </Button>
         </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground flex items-center">
            <Clock className="w-4 h-4 mr-2 text-primary/80" /> {session.dateTime}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-1 flex justify-end gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/counselor/students/${session.id}/profile`}>Student Profile</Link>
        </Button>
        <Button size="sm" asChild variant="secondary">
          <Link href={`/counselor/sessions/${session.id}/notes`}>Prepare Notes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
