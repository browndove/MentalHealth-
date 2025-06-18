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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={student.avatarUrl || `https://placehold.co/64x64.png`} alt={student.name} data-ai-hint={student.aiHint || "student portrait"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-headline">{student.name}</CardTitle>
          <CardDescription>ID: {student.universityId}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {student.lastSession && (
          <p className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary" /> Last Session: {student.lastSession}</p>
        )}
        {student.nextSession && (
          <p className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2 text-accent" /> Next Session: {student.nextSession}</p>
        )}
        {!student.lastSession && !student.nextSession && (
            <p className="text-muted-foreground">No recent session activity.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/counselor/students/${student.id}/profile`}><User className="w-4 h-4 mr-2"/>View Profile</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/counselor/sessions/new?studentId=${student.id}`}><MessageSquare className="w-4 h-4 mr-2"/>New Note</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
