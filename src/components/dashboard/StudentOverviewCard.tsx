
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

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
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card flex flex-col shadow-lg">
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
      <CardContent className="p-5 pt-0 space-y-2 text-sm flex-grow">
        {student.lastSession && (
          <p className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary/80" /> Last: {student.lastSession}</p>
        )}
        {student.nextSession && (
          <p className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2 text-accent/80" /> Next: {student.nextSession}</p>
        )}
        {!student.lastSession && !student.nextSession && (
            <p className="text-muted-foreground py-1">No recent session activity.</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t bg-muted/50">
        <Button size="sm" asChild className="w-full">
          <Link href={`/counselor/students/${student.id}/profile`}>View Profile <ArrowRight className="w-4 h-4 ml-2"/></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
