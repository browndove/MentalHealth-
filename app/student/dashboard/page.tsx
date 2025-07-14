'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarPlus, Bot, BookOpen, ClipboardList, UserCircle, Activity, 
  Smile, ArrowRight, Heart, Brain, TreePine, Sun, Moon,
  Target, Trophy, Zap, Flower, Wind, Mountain, Star, Sparkles,
  MessageCircle, Camera, Music, Palette, Coffee, Leaf, Cherry
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const upcomingAppointment = { 
  id: '1', 
  counselor: 'Dr. Sakura Tanaka', 
  date: '2024-08-15', 
  time: '10:00 AM', 
  type: 'Video Call' 
};

const wellnessStats = {
  streak: 7,
  completedSessions: 12,
  moodAverage: 7.2,
  weeklyProgress: 85
};

const todaysMood = {
  morning: { level: 8, emotion: 'Calm', color: 'bg-blue-500' },
  afternoon: { level: 6, emotion: 'Focused', color: 'bg-green-500' },
  evening: { level: 7, emotion: 'Peaceful', color: 'bg-purple-500' }
};

const recentActivities = [
  { id: 1, type: 'TreePine', title: 'Morning Zen', duration: '10 min', completed: true },
  { id: 2, type: 'journaling', title: 'Gratitude Journal', duration: '5 min', completed: true },
  { id: 3, type: 'breathing', title: 'Deep Breathing', duration: '3 min', completed: false }
];

export default function StudentDashboardPage() {
  const { user } = useAuth();

  const FeatureCard = ({ 
    title, 
    description, 
    href, 
    icon: Icon, 
    tag, 
    bgColorClass, 
    children,
    className = ""
  }: {
    title: string,
    description: string,
    href: string,
    icon: React.ElementType,
    tag?: string,
    bgColorClass?: string,
    children?: React.ReactNode,
    className?: string
  }) => (
    <Card className={cn(
      "group relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm border-0",
      bgColorClass || "bg-white/90",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      <CardHeader className="relative z-10">
        <div className="mb-4 flex justify-between items-center">
          <div className="p-3 bg-white/30 rounded-xl backdrop-blur-sm border border-white/20">
            <Icon className="h-6 w-6 text-white drop-shadow-sm"/>
          </div>
          {tag && (
            <Badge variant="secondary" className="bg-white/30 text-white border-0 backdrop-blur-sm">
              {tag}
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl font-bold text-white drop-shadow-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 flex-1">
        <p className="text-white/90 mb-4">{description}</p>
        {children}
      </CardContent>
      <CardFooter className="relative z-10">
        <Button asChild variant="secondary" className="mt-4 bg-white/90 text-gray-800 hover:bg-white w-full backdrop-blur-sm border-0 shadow-lg">
          <Link href={href}>
            {title} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = "text-gray-600",
    bgColor = "bg-white"
  }: {
    title: string,
    value: string | number,
    subtitle?: string,
    icon: React.ElementType,
    color?: string,
    bgColor?: string
  }) => (
    <Card className={cn("p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1", bgColor)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={cn("text-2xl font-bold", color)}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
        <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full">
          <Icon className="h-6 w-6 text-pink-600"/>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
      {/* Floating Cherry Blossoms Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <Cherry className="h-4 w-4 text-pink-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header with Japanese Greeting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              おかえりなさい, {user?.fullName?.split(' ')[0]}! {/* "Welcome back" in Japanese */}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Your wellness journey continues with grace and mindfulness</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200">
              <Star className="h-4 w-4 mr-1" />
              {wellnessStats.streak} day streak
            </Badge>
          </div>
        </div>

        {/* Wellness Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Mindfulness Streak"
            value={wellnessStats.streak}
            subtitle="consecutive days"
            icon={Zap}
            color="text-orange-600"
            bgColor="bg-gradient-to-br from-orange-50 to-yellow-50"
          />
          <StatCard 
            title="Sessions Completed"
            value={wellnessStats.completedSessions}
            subtitle="this month"
            icon={Trophy}
            color="text-green-600"
            bgColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard 
            title="Average Mood"
            value={`${wellnessStats.moodAverage}/10`}
            subtitle="this week"
            icon={Smile}
            color="text-blue-600"
            bgColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard 
            title="Weekly Progress"
            value={`${wellnessStats.weeklyProgress}%`}
            subtitle="goals achieved"
            icon={Target}
            color="text-purple-600"
            bgColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* Main Bento Grid */}
        <div className="grid auto-rows-[20rem] grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Request Appointment - Large Card */}
          <div className="md:col-span-2 md:row-span-2">
            <FeatureCard 
              title="Schedule Counseling"
              description="Connect with our certified counselors for personalized support in a serene, confidential environment."
              href="/student/appointments/request"
              icon={CalendarPlus}
              tag="Priority"
              bgColorClass="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500"
              className="h-full"
            >
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-white/20 rounded-lg backdrop-blur-sm">
                  <h4 className="font-semibold text-white mb-2">Available Today</h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-white/30 text-white border-0">2:00 PM</Badge>
                    <Badge variant="secondary" className="bg-white/30 text-white border-0">4:30 PM</Badge>
                    <Badge variant="secondary" className="bg-white/30 text-white border-0">6:00 PM</Badge>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </div>

          {/* AI Assistant */}
          <div className="md:col-span-1">
            <FeatureCard 
              title="AI Companion"
              description="Meet Ama-chan, your 24/7 AI wellness companion for instant support and guidance."
              href="/student/ai-assistant"
              icon={Bot}
              tag="Always Available"
              bgColorClass="bg-gradient-to-br from-indigo-500 to-purple-600"
            >
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online now</span>
              </div>
            </FeatureCard>
          </div>

          {/* Mood Tracker */}
          <div className="md:col-span-1">
            <Card className="h-full bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
              <CardHeader>
                <CardTitle className="text-blue-800">Today's Mood</CardTitle>
                <CardDescription>Track your emotional journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(todaysMood).map(([time, mood]) => (
                  <div key={time} className="flex items-center justify-between">
                    <span className="text-sm capitalize font-medium">{time}</span>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", mood.color)}></div>
                      <span className="text-xs text-gray-600">{mood.emotion}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/student/mood-tracker">
                    Update Mood <Heart className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Upcoming Session */}
          <div className="md:col-span-1">
            <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-0">
              <CardHeader>
                <CardTitle className="text-green-800">Next Session</CardTitle>
                <CardDescription>Upcoming appointment</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
                {upcomingAppointment ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-green-100 rounded-full">
                      <UserCircle className="h-8 w-8 text-green-600"/>
                    </div>
                    <p className="font-semibold text-green-800">{upcomingAppointment.counselor}</p>
                    <p className="text-green-600 text-sm">{upcomingAppointment.date}</p>
                    <p className="text-green-600 text-sm">{upcomingAppointment.time}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No upcoming sessions</p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                  <Link href="/student/sessions">View All Sessions</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Meditation & Mindfulness */}
          <div className="md:col-span-1">
            <FeatureCard 
              title="Zen Garden"
              description="Guided meditation sessions inspired by Japanese mindfulness practices."
              href="/student/meditation"
              icon={TreePine}
              tag="Mindfulness"
              bgColorClass="bg-gradient-to-br from-teal-500 to-cyan-600"
            >
              <div className="text-white/80 text-sm">
                <p>🧘‍♀️ 5 min morning meditation</p>
                <p>🌸 Cherry blossom visualization</p>
              </div>
            </FeatureCard>
          </div>

          {/* Daily Activities */}
          <div className="md:col-span-1">
            <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 border-0">
              <CardHeader>
                <CardTitle className="text-purple-800">Daily Activities</CardTitle>
                <CardDescription>Your wellness routine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      activity.completed ? "bg-green-100" : "bg-gray-100"
                    )}>
                      {activity.completed ? (
                        <Sparkles className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.duration}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Journal & Reflection */}
          <div className="md:col-span-1">
            <FeatureCard 
              title="Digital Journal"
              description="Express your thoughts and track your emotional journey through writing."
              href="/student/journal"
              icon={BookOpen}
              tag="Reflect"
              bgColorClass="bg-gradient-to-br from-amber-500 to-orange-600"
            >
              <div className="text-white/80 text-sm">
                <p>✍️ 3 entries this week</p>
                <p>🎯 Gratitude practice active</p>
              </div>
            </FeatureCard>
          </div>

          {/* Wellness Resources */}
          <div className="md:col-span-1">
            <Card className="h-full bg-gradient-to-br from-rose-50 to-pink-50 border-0">
              <CardHeader>
                <CardTitle className="text-rose-800">Wellness Library</CardTitle>
                <CardDescription>Resources & guides</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-rose-100 rounded-full mb-3">
                  <BookOpen className="h-8 w-8 text-rose-600"/>
                </div>
                <p className="text-rose-700 text-sm">Explore curated wellness content</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
                  <Link href="/student/resources">Explore Library</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Breathing Exercises */}
          <div className="md:col-span-1">
            <FeatureCard 
              title="Breathing Space"
              description="Guided breathing exercises for instant calm and stress relief."
              href="/student/breathing"
              icon={Wind}
              tag="Quick Relief"
              bgColorClass="bg-gradient-to-br from-sky-500 to-blue-600"
            >
              <div className="text-white/80 text-sm">
                <p>💨 4-7-8 breathing technique</p>
                <p>🌊 Ocean wave visualization</p>
              </div>
            </FeatureCard>
          </div>

          {/* Community & Support */}
          <div className="md:col-span-1">
            <FeatureCard 
              title="Peer Support"
              description="Connect with fellow students in a safe, moderated environment."
              href="/student/community"
              icon={MessageCircle}
              tag="Community"
              bgColorClass="bg-gradient-to-br from-violet-500 to-purple-600"
            >
              <div className="text-white/80 text-sm">
                <p>👥 12 active discussions</p>
                <p>💬 Anonymous support available</p>
              </div>
            </FeatureCard>
          </div>

          {/* Progress Tracking */}
          <div className="md:col-span-2">
            <Card className="h-full bg-gradient-to-br from-indigo-50 to-blue-50 border-0">
              <CardHeader>
                <CardTitle className="text-indigo-800">Wellness Progress</CardTitle>
                <CardDescription>Your journey over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Goal Progress</span>
                    <span className="font-semibold">{wellnessStats.weeklyProgress}%</span>
                  </div>
                  <Progress value={wellnessStats.weeklyProgress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-indigo-700">Meditation</p>
                    <p className="text-gray-600">7/7 days</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-indigo-700">Journaling</p>
                    <p className="text-gray-600">5/7 days</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/student/progress">View Detailed Progress</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Profile Management */}
          <div className="md:col-span-1">
            <Card className="h-full bg-gradient-to-br from-gray-50 to-slate-50 border-0">
              <CardHeader>
                <CardTitle className="text-gray-800">Profile</CardTitle>
                <CardDescription>Manage your information</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-gray-100 rounded-full mb-3">
                  <UserCircle className="h-8 w-8 text-gray-600"/>
                </div>
                <p className="text-gray-600 text-sm">Keep your details updated</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Link href="/student/profile">Update Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Crisis Support */}
          <div className="md:col-span-1">
            <Card className="h-full bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Crisis Support</CardTitle>
                <CardDescription>Immediate help available</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-red-100 rounded-full mb-3">
                  <Heart className="h-8 w-8 text-red-600"/>
                </div>
                <p className="text-red-700 text-sm font-medium">24/7 emergency support</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <Link href="/student/crisis">Get Help Now</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}