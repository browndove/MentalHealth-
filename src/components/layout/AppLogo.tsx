import Link from 'next/link';
import { Brain } from 'lucide-react'; // Or a more culturally relevant icon if available

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group" aria-label="Accra TechMind Home">
      {/* Consider replacing Brain with a custom SVG or a more culturally neutral/positive mental health icon if Brain feels too clinical */}
      <div className="p-2 bg-primary/10 rounded-lg">
        <Brain className="h-7 w-7 text-primary transition-transform group-hover:rotate-6" />
      </div>
      <span className="font-headline text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
        Accra TechMind
      </span>
    </Link>
  );
}
