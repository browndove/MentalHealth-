
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
import { AppLogo } from '@/components/layout/AppLogo';

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
        // This is the error state for users with an auth record but no valid role in Firestore
        console.error(`HomePage: User ${user.uid} logged in, but role is '${user.role || 'not set/null'}'. This usually means their document in the 'users' collection is missing or incomplete.`);
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-semibold mb-2 text-destructive-foreground">Could not determine your user role.</h1>
                <p className="text-muted-foreground mb-1">This might be due to an incomplete profile or a data issue.</p>
                <p className="text-muted-foreground mb-4 text-sm max-w-md">
                   Your account exists, but your user profile document in the database is either missing or does not have a 'role' field.
                </p>
                <p className="text-muted-foreground text-xs mb-2">
                  UID: {user.uid}
                </p>
                <p className="text-muted-foreground text-xs mb-4">
                  Please ensure a document exists in your Firestore 'users' collection with this ID, and that it has a field named 'role' set to either 'student' or 'counselor'.
                </p>
                <Button onClick={() => router.push('/login')}>Try Logging In Again</Button>
            </div>
        );
     }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <AppLogo />
        <nav className="space-x-3">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </nav>
      </header>

      <section className="container mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight mb-6">
            Your Companion for Mental Wellness
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Accra TechMind provides confidential counseling and mental health resources to empower students on their academic journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
             <Button size="lg" asChild className="shadow-lg transition-transform hover:scale-105">
              <Link href="/register">
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="shadow-lg transition-transform hover:scale-105">
              <Link href="/student/resources">
                <BookOpen className="mr-2 h-5 w-5" /> Explore Resources
              </Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <Image 
            src="https://placehold.co/500x500.png" 
            alt="An abstract illustration representing mental clarity and support" 
            width={500} 
            height={500} 
            className="rounded-full shadow-2xl" 
            data-ai-hint="calm abstract illustration blue green" 
            priority
          />
        </div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center mb-10">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResources.map(resource => (
              <Card key={resource.id} className="bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
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
                  <Button asChild variant="secondary" className="w-full mt-2">
                    <Link href="#">Visit Resource</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
              <Button size="lg" asChild>
                  <Link href="/student/resources">Explore All Resources</Link>
              </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <Card className="bg-gradient-to-r from-primary/80 to-accent/80 text-primary-foreground p-8 md:p-12 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background/50 shadow-lg">
            <AvatarImage src="https://placehold.co/128x128.png" alt="Ama, AI Mental Buddy" data-ai-hint="friendly AI assistant avatar dark skin" />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">AMA</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold font-headline mb-1">Meet Ama, Your AI Assistant</h3>
            <p className="text-lg opacity-90 mb-6">
              For immediate support, Ama can help answer your questions, provide self-help information, and guide you to the right resources, 24/7.
            </p>
          </div>
          <Button size="lg" asChild variant="secondary" className="bg-card hover:bg-card/90 text-card-foreground shadow-md transition-transform hover:scale-105 px-8 py-4">
            <Link href="/student/ai-assistant">
              Chat with Ama <Send className="ml-2 h-5 w-5" />
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
