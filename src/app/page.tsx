
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, AlertTriangle, BookOpen, PlayCircle, FileText, Headphones, Youtube, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Placeholder data for featured resources based on the image
const featuredResources = [
  {
    id: 'res1',
    title: 'Understanding and Managing Anxiety',
    type: 'Article',
    category: 'Anxiety',
    Icon: FileText,
    imageHint: 'Ghanaian student thoughtful',
    imageUrl: 'https://placehold.co/400x300.png',
  },
  {
    id: 'res2',
    title: 'Guided Meditation for Stress Relief (10 min)',
    type: 'Audio',
    category: 'Stress Management',
    Icon: Headphones,
    imageHint: 'man meditating outdoors Ghana',
    imageUrl: 'https://placehold.co/400x300.png',
  },
  {
    id: 'res3',
    title: 'Effective Study Habits for Academic Success',
    type: 'Video',
    category: 'Academic Support',
    Icon: Youtube,
    imageHint: 'student studying focused Ghana',
    imageUrl: 'https://placehold.co/400x300.png',
  },
];

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
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading session...</p>
      </div>
    );
  }
  
  if (user) {
     if (user.role === 'student' || user.role === 'counselor') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
            </div>
        );
     } else {
        console.log(`HomePage: User ${user.uid} logged in, but role is '${user.role || 'not set/null'}'. Displaying login issue message.`);
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-semibold mb-2 text-destructive-foreground">Login Issue</h1>
                <p className="text-muted-foreground mb-1">Could not determine your user role.</p>
                <p className="text-muted-foreground mb-4 text-sm">This might be due to an incomplete profile or a data issue.</p>
                <p className="text-muted-foreground text-xs mb-2">
                  UID: {user.uid}
                </p>
                <p className="text-muted-foreground text-xs mb-4">
                  Please ensure your 'role' (must be 'student' or 'counselor') is correctly set in your user profile in the Firestore 'users' database collection.
                  Currently detected role: <span className="font-semibold">{user.role || 'Not set'}</span>.
                </p>
                <Button onClick={() => router.push('/login')}>Try Logging In Again</Button>
            </div>
        );
     }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header for non-logged-in users, if needed, or integrated into Hero */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-end items-center z-10">
        <nav className="space-x-3">
          <Button variant="outline" asChild className="btn-pill border-muted hover:bg-muted">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="btn-pill bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/register">Register</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <Image 
            src="https://placehold.co/400x400.png" 
            alt="Happy, calm student illustration" 
            width={300} 
            height={300} 
            className="rounded-full mx-auto md:mx-0 mb-8 shadow-lg" 
            data-ai-hint="calm woman illustration orange shirt" 
            priority
          />
        </div>
        <div className="md:w-1/2 md:pl-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight mb-6">
            Your Companion for Wellness
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Empowering students with mental health resources and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="btn-pill bg-secondary hover:bg-muted text-secondary-foreground shadow-md transition-transform hover:scale-105">
              <Link href="/student/resources">
                <BookOpen className="mr-2 h-5 w-5" /> Resources
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="btn-pill border-muted hover:bg-muted text-muted-foreground shadow-md transition-transform hover:scale-105">
              <Link href="/student/resources?filter=guided-sessions"> {/* Placeholder link */}
                <PlayCircle className="mr-2 h-5 w-5" /> Guided Sessions
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Kente Divider - Placeholder. Replace with an actual Kente pattern image/SVG */}
      <div className="kente-divider my-12 md:my-16" aria-hidden="true"></div>

      {/* Featured Resources Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold font-headline text-center mb-10">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredResources.map(resource => (
            <Card key={resource.id} className="bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group">
              <div className="relative h-52 w-full">
                <Image 
                  src={resource.imageUrl} 
                  alt={resource.title} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={resource.imageHint}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <resource.Icon className="w-4 h-4 mr-1.5 text-primary" />
                  <span>{resource.type}</span>
                  <span className="mx-1.5">•</span>
                  <span>{resource.category}</span>
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">{resource.title}</CardTitle>
                <Button asChild variant="outline" className="w-full btn-card-action btn-pill mt-2">
                  <Link href="#">Visit Resource</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button size="lg" asChild className="btn-pill bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/student/resources">Explore All Resources</Link>
            </Button>
        </div>
      </section>

      {/* Kente Divider Placeholder */}
      <div className="kente-divider my-12 md:my-16" aria-hidden="true"></div>

      {/* Ama - Your Mental Buddy Section */}
      <section className="container mx-auto px-6 py-16">
        <Card className="bg-secondary/50 p-8 md:p-12 rounded-xl shadow-xl flex flex-col md:flex-row items-center gap-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
            <AvatarImage src="https://placehold.co/128x128.png" alt="Ama, AI Mental Buddy" data-ai-hint="friendly AI assistant avatar dark skin" />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">AMA</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold font-headline mb-1">Ama</h3>
            <p className="text-xl text-primary font-medium mb-3">Your Mental Buddy</p>
            <p className="text-muted-foreground mb-6">
              An AI mental buddy, designed to listen and help you find the information you need.
            </p>
          </div>
          <Button size="lg" asChild className="btn-pill bg-card hover:bg-card/90 text-foreground shadow-md transition-transform hover:scale-105 px-8 py-4">
            <Link href="/student/ai-assistant">
              Let's talk about your thoughts & feelings <Send className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </Card>
      </section>

      <footer className="container mx-auto text-center py-12 mt-12 border-t border-border">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Accra TechMind. All rights reserved.</p>
      </footer>
    </div>
  );
}
