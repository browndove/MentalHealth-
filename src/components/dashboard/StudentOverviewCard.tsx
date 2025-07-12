
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Calendar, MessageSquare, ArrowRight, TrendingUp, AlertCircle, Sparkle } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { format, parseISO } from 'date-fns';

interface StudentOverviewCardProps {
  student: {
    id: string;
    name: string;
    universityId: string;
    lastSession?: string;
    nextSession?: string;
    avatarUrl?: string;
    aiHint?: string;
    status: 'Active' | 'Inactive' | 'Needs Follow-up' | 'New';
  };
  isSelected: boolean;
  onSelectionChange: (id: string, isSelected: boolean) => void;
}

export function StudentOverviewCard({ student, isSelected, onSelectionChange }: StudentOverviewCardProps) {
  const initials = student.name.split(" ").map(n => n[0]).join("");

  const statusStyles = {
    'Active': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
    'Inactive': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700',
    'Needs Follow-up': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-400 dark:border-yellow-800',
    'New': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
  };

  const StatusIcon = {
    'Active': TrendingUp,
    'Inactive': User,
    'Needs Follow-up': AlertCircle,
    'New': Sparkle,
  };
  
  const Icon = StatusIcon[student.status];

  return (
    <Card 
      className={cn(
        "transition-all duration-300 bg-card flex flex-col shadow-sm relative",
        isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      <div className="absolute top-3 left-3 z-10">
        <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(student.id, !!checked)}
            aria-label={`Select ${student.name}`}
            className="bg-background/50 backdrop-blur-sm"
        />
      </div>
      <CardHeader className="p-4 flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarImage src={student.avatarUrl || ''} alt={student.name} data-ai-hint={student.aiHint || "student portrait Ghana"} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-card-foreground">{student.name}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">ID: {student.universityId}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 space-y-2 text-sm flex-grow">
        <Badge variant="outline" className={cn("font-medium", statusStyles[student.status])}>
            <Icon className="h-3 w-3 mr-1.5" />
            {student.status}
        </Badge>
        <div className="text-muted-foreground pt-2 border-t mt-2">
            {student.lastSession ? (
              <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary/80" /> Last: {format(parseISO(student.lastSession), 'MMM d, yyyy')}</p>
            ) : (
                 <p className="flex items-center text-muted-foreground/80 italic"><Calendar className="w-4 h-4 mr-2" /> No past sessions</p>
            )}
            {student.nextSession && (
              <p className="flex items-center font-semibold text-primary/90"><Calendar className="w-4 h-4 mr-2" /> Next: {format(parseISO(student.nextSession), 'MMM d, yyyy')}</p>
            )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-2 border-t bg-muted/50">
        <Button size="sm" asChild className="w-full">
          <Link href={`/counselor/students/${student.id}/profile`}>View Profile <ArrowRight className="w-4 h-4 ml-2"/></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
