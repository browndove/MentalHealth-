
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface Counselor {
  id: string;
  name: string;
  avatarUrl?: string;
  specialties: string[];
}

interface CounselorSelectionCardProps {
  counselor: Counselor;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function CounselorSelectionCard({ counselor, isSelected, onSelect }: CounselorSelectionCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 relative overflow-hidden",
        isSelected ? "border-primary ring-2 ring-primary shadow-lg" : "border-border hover:shadow-md hover:border-primary/50"
      )}
      onClick={() => onSelect(counselor.id)}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
          <CheckCircle className="h-4 w-4" />
        </div>
      )}
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-muted">
          <AvatarImage src={counselor.avatarUrl} alt={counselor.name} data-ai-hint="counselor portrait" />
          <AvatarFallback className="text-2xl">{counselor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-lg text-foreground">{counselor.name}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {counselor.specialties.slice(0, 3).map(spec => (
              <Badge key={spec} variant="secondary">{spec}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
