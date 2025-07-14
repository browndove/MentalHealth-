
import Link from 'next/link';
import { MessageCircleHeart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-foreground font-semibold tracking-tight", className)}>
      <div className="p-1.5 bg-primary rounded-lg">
        <MessageCircleHeart className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-xl">Accra TechMind</span>
    </Link>
  );
}
