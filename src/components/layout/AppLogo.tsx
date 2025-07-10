import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group" aria-label="Accra TechMind Home">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-primary shadow-sm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground transition-transform group-hover:scale-110">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="font-headline text-xl font-bold text-foreground group-hover:text-primary transition-colors">
        Accra TechMind
      </span>
    </Link>
  );
}
