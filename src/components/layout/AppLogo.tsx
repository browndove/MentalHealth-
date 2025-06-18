import Link from 'next/link';
import { Brain } from 'lucide-react';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <Brain className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
      <span className="font-headline text-2xl font-semibold text-primary group-hover:text-accent transition-colors">
        Accra TechMind
      </span>
    </Link>
  );
}
