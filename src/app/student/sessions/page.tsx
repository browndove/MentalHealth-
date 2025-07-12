
'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Star, 
  Bell, 
  MessageCircle, 
  FileText, 
  Video,
  Plus,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentSessions } from "@/lib/actions";
import { format, formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";

// Define a type for the session data we expect from the backend
interface Session {
  id: string;
  sessionNumber: number;
  date: string; // ISO string
  time: string;
  counselor: {
    name: string;
    avatarUrl?: string;
    avatarFallback: string;
    specialties: string[];
  };
  duration: number; // in minutes
  lastContact: string; // ISO string
  type: 'Video Call' | 'Chat' | 'In-Person';
  status: 'Upcoming' | 'Completed' | 'Pending' | 'Cancelled';
  notesAvailable: boolean;
}

const statusStyles = {
    Upcoming: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    Completed: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    Cancelled: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
};

const StatusIcon = {
    Upcoming: Bell,
    Completed: CheckCircle2,
    Pending: Loader2,
    Cancelled: XCircle,
};

export default function StudentSessionsDashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (user) {
        setLoading(true);
        setError(null);
        const result = await getStudentSessions(user.uid);
        if ('error' in result) {
            setError(result.error);
        } else {
            setSessions(result.data as Session[]);
        }
        setLoading(false);
    } else {
        setLoading(false); // If no user, stop loading.
    }
  }, [user]);
  
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const totalDurationMinutes = sessions
    .filter(s => s.status === 'Completed')
    .reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalHours = (totalDurationMinutes / 60).toFixed(1);

  const nextSession = sessions.find(s => s.status === 'Upcoming');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center animate-pulse">
            <div>
                <div className="h-8 bg-muted rounded w-64 mb-2"></div>
                <div className="h-4 bg-muted rounded w-96"></div>
            </div>
            <div className="h-10 bg-muted rounded-md w-40"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={`stat-${i}`} className="h-36 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <div key={`action-${i}`} className="h-24 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-56 bg-muted rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive-foreground mb-2">Failed to Load Sessions</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-gray-800 dark:text-gray-100">My Sessions Dashboard</h1>
          <p className="text-base text-gray-600 dark:text-gray-300 mt-1">Your journey to wellness, all in one place.</p>
        </div>
        <Button asChild size="lg" className="shadow-lg hover:scale-105 transition-transform duration-300">
          <Link href="/student/appointments/request">
            <Plus className="mr-2 h-5 w-5"/> Book New Session
          </Link>
        </Button>
      </div>

      {/* 2. Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedSessions}</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hours of Support</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">Investing in your well-being</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Session</CardTitle>
            <Bell className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {nextSession ? (
                <>
                 <div className="text-lg font-bold">{format(new Date(nextSession.date), "EEE, MMM dd")}</div>
                 <p className="text-xs text-muted-foreground">{nextSession.time} • {nextSession.type}</p>
                </>
            ) : (
                <div className="text-lg font-bold">None Scheduled</div>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Great consistency!</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Quick Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4 flex flex-col items-start bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/60 border-blue-200 dark:border-blue-800 transition-all">
          <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2"/>
          <span className="font-semibold text-foreground">Message Counselor</span>
          <span className="text-xs text-muted-foreground">Send a secure message</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-start bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/60 border-green-200 dark:border-green-800 transition-all">
          <FileText className="h-6 w-6 text-green-600 dark:text-green-400 mb-2"/>
          <span className="font-semibold text-foreground">View Session Notes</span>
          <span className="text-xs text-muted-foreground">Review past summaries</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-start bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/60 border-purple-200 dark:border-purple-800 transition-all">
          <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2"/>
          <span className="font-semibold text-foreground">Reschedule a Session</span>
          <span className="text-xs text-muted-foreground">Find a new time</span>
        </Button>
      </div>

      {/* 5. Progress Tracking Section */}
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Your Journey Progress</CardTitle>
            <CardDescription>You've completed {completedSessions} of your 10-session goal this term.</CardDescription>
        </CardHeader>
        <CardContent>
            <Progress value={completedSessions * 10} className="h-3" />
            <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                <p>Week-over-week progress: <span className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1"><TrendingUp className="h-4 w-4"/> +1 session</span></p>
                <p className="font-semibold text-primary">Keep up the great work!</p>
            </div>
        </CardContent>
      </Card>

      {/* 4. Enhanced Session Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Session History</h2>
        {sessions.length > 0 ? (
          sessions.map(session => {
            const StatusIconComponent = StatusIcon[session.status];
            return (
              <Card key={session.id} className="shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row">
                  <div className="p-5 md:w-2/3 md:border-r">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={session.counselor.avatarUrl} />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-purple-400 to-blue-500 text-white">{session.counselor.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">Session with {session.counselor.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">{format(new Date(session.date), "EEEE, MMMM d, yyyy")} at {session.time}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {session.counselor.specialties.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-muted-foreground mt-4 pt-4 border-t">
                      <p><strong>Duration:</strong> {session.duration} min</p>
                      <p><strong>Session #:</strong> {session.sessionNumber}</p>
                      <p><strong>Last Contact:</strong> {formatDistanceToNowStrict(new Date(session.lastContact))} ago</p>
                    </div>
                  </div>

                  <div className="p-5 md:w-1/3 flex flex-col justify-between items-start md:items-end">
                    <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full border ${statusStyles[session.status]}`}>
                      <StatusIconComponent className={`h-4 w-4 ${session.status === 'Pending' ? 'animate-spin' : ''}`} />
                      {session.status}
                    </div>
                    <div className="flex flex-row md:flex-col lg:flex-row gap-2 mt-4 w-full md:w-auto md:items-end">
                      {session.status === 'Upcoming' && (
                        <React.Fragment>
                          <Button asChild className="w-full lg:w-auto flex-1"><Link href={`/session/${session.id}/video`}><Video className="mr-2 h-4 w-4"/>Join Session</Link></Button>
                          <Button variant="outline" className="w-full lg:w-auto flex-1">Reschedule</Button>
                        </React.Fragment>
                      )}
                      {session.status === 'Completed' && (
                        <Button variant="outline" className="w-full lg:w-auto"><FileText className="mr-2 h-4 w-4"/>View Notes</Button>
                      )}
                      {session.status === 'Cancelled' && (
                        <Button variant="secondary" className="w-full lg:w-auto">Re-Book</Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <Image src="https://placehold.co/300x200.png" alt="No sessions" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty calendar illustration" />
              <p className="text-muted-foreground">You haven't had any sessions yet. Book one to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
