
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/layout/AppLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react'; // Added AlertTriangle

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'student') {
        router.replace('/student/dashboard');
      } else if (user.role === 'counselor') {
        router.replace('/counselor/dashboard');
      }
      // If role is null or other, no redirect from here; UI will handle it.
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading session...</p>
      </div>
    );
  }
  
  if (user) {
     // User is loaded and exists
     if (user.role === 'student' || user.role === 'counselor') {
        // Valid role, useEffect is redirecting
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
            </div>
        );
     } else {
        // User is loaded, but role is null or invalid
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-semibold mb-2 text-destructive-foreground">Login Issue</h1>
                <p className="text-muted-foreground mb-1">Could not determine your user role.</p>
                <p className="text-muted-foreground mb-4 text-sm">This might be due to an incomplete profile or a data issue.</p>
                <p className="text-muted-foreground text-xs mb-4">Please ensure your 'role' (student/counselor) is correctly set in your user profile in the database.</p>
                <Button onClick={() => router.push('/login')}>Try Logging In Again</Button>
                 {/* It might be useful to have a logout button here too if stuck */}
            </div>
        );
     }
  }

  // Default homepage content for non-logged-in users
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center">
        <AppLogo />
        <nav className="space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </nav>
      </header>

      <main className="flex flex-col items-center text-center space-y-8 pt-16">
        <Card className="w-full max-w-2xl shadow-2xl overflow-hidden">
          <div className="relative h-60 w-full">
            <Image 
              src="https://placehold.co/800x400.png" 
              alt="Supportive community" 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{objectFit: "cover"}}
              priority
              data-ai-hint="mental health support" 
            />
            <div className="absolute inset-0 bg-primary/30" />
          </div>
          <CardHeader className="pb-4">
            <CardTitle className="text-4xl sm:text-5xl font-headline tracking-tight text-primary">
              Welcome to Accra TechMind
            </CardTitle>
            <CardDescription className="text-lg sm:text-xl text-muted-foreground pt-2">
              Your dedicated space for mental wellness and counseling support at Accra Technical University.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground/80">
              We provide accessible tools and resources to help you navigate your academic journey with confidence and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
                <Link href="/login">Access Your Portal</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg transition-transform hover:scale-105">
                <Link href="/register">Create an Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {[
            { title: "Confidential Support", description: "Connect with professional counselors in a secure environment.", icon: "Lock" , dataAiHint: "security privacy"},
            { title: "Easy Scheduling", description: "Book appointments that fit your schedule with ease.", icon: "CalendarDays", dataAiHint: "calendar schedule" },
            { title: "AI-Powered Assistance", description: "Get instant answers to common questions from our helpful AI.", icon: "Bot", dataAiHint: "artificial intelligence" }
          ].map(feature => (
             <Card key={feature.title} className="text-left hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                     {/* Using a generic shield icon for simplicity as Lock/CalendarDays/Bot aren't directly usable here without mapping like in SidebarNav */}
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <CardTitle className="font-headline text-primary">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <footer className="w-full max-w-4xl text-center py-8 mt-12 border-t">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Accra TechMind. All rights reserved.</p>
      </footer>
    </div>
  );
}
