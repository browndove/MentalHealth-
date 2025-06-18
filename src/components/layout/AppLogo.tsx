import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2.5 group" aria-label="Mental Guide Home">
      <div className="flex h-8 w-8 items-center justify-center rounded-md overflow-hidden">
        {/* Simplified two-tone square logo */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
          <rect width="32" height="32" rx="6" fill="hsl(var(--primary))"/>
          <rect x="6" y="6" width="20" height="20" rx="3" fill="hsl(var(--background))" className="opacity-75 group-hover:opacity-100"/>
           <rect x="10" y="10" width="12" height="12" rx="2" fill="hsl(var(--primary))" className="opacity-50 group-hover:opacity-75"/>
        </svg>
      </div>
      <span className="font-headline text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
        Mental Guide
      </span>
    </Link>
  );
}
