import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Calendar, MessageSquare } from 'lucide-react';

interface StudentOverviewCardProps {
  student: {
    id: string;
    name: string;
    universityId: string;
    lastSession?: string;
    nextSession?: string;
    avatarUrl?: string;
    aiHint?: string;
  };
}

export function StudentOverviewCard({ student }: StudentOverviewCardProps) {
  const initials = student.name.split(" ").map(n => n[0]).join("");
  return (
    <Card className="hover:shadow-lg transition-all duration-300 rounded-xl border border-border hover:-translate-y-0.5 bg-card">
      <CardHeader className="p-5 flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14 border-2 border-primary/30">
          <AvatarImage src={student.avatarUrl || `https://placehold.co/64x64.png`} alt={student.name} data-ai-hint={student.aiHint || "student portrait Ghana"} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-semibold text-card-foreground">{student.name}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">ID: {student.universityId}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-2 text-sm">
        {student.lastSession && (
          <p className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary/80" /> Last Session: {student.lastSession}</p>
        )}
        {student.nextSession && (
          <p className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2 text-accent/80" /> Next Session: {student.nextSession}</p>
        )}
        {!student.lastSession && !student.nextSession && (
            <p className="text-muted-foreground py-1">No recent session activity.</p>
        )}
      </CardContent>
      <CardFooter className="p-5 pt-2 flex justify-between gap-2">
        <Button variant="outline" size="sm" asChild className="btn-pill !px-4 !py-2 border-input-border text-foreground hover:bg-muted">
          <Link href={`/counselor/students/${student.id}/profile`}><User className="w-3.5 h-3.5 mr-1.5"/>Profile</Link>
        </Button>
        <Button size="sm" asChild className="btn-pill !px-4 !py-2 btn-card-action">
          <Link href={`/counselor/sessions/new-session-placeholder/notes?studentId=${student.id}`}><MessageSquare className="w-3.5 h-3.5 mr-1.5"/>New Note</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
