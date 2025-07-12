
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Edit3, BadgeCheck, Mail, Phone, Briefcase, Loader2, Award, Star } from 'lucide-react';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function CounselorProfilePage() {
  const { user, loading } = useAuth();

  const counselorProfile = {
    fullName: user?.fullName || 'Counselor Name',
    email: user?.email || 'counselor@university.ac.uk',
    universityId: user?.universityId || 'COUNS0000',
    phoneNumber: '02012345678',
    bio: 'Experienced counselor specializing in cognitive behavioral therapy (CBT) and stress management. Dedicated to supporting student well-being and academic success.',
    avatarUrl: user?.avatarUrl || 'https://placehold.co/128x128.png',
    specializations: ['CBT', 'Stress Management', 'Anxiety Disorders', 'Student Mental Health'],
    qualifications: 'PhD in Clinical Psychology, LPC',
    yearsOfExperience: 10,
  };
  
  if (loading) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64"/>
                <Skeleton className="h-10 w-32"/>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-96 rounded-xl lg:col-span-2"/>
                <div className="space-y-8">
                    <Skeleton className="h-48 rounded-xl"/>
                    <Skeleton className="h-48 rounded-xl"/>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Counselor Profile</h1>
          <p className="text-muted-foreground">Your professional information and statistics.</p>
        </div>
        <Button variant="outline" disabled>
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 p-8 flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                      <AvatarImage src={counselorProfile.avatarUrl} alt={counselorProfile.fullName} data-ai-hint="professional portrait" />
                      <AvatarFallback className="text-4xl">{counselorProfile.fullName?.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold">{counselorProfile.fullName}</h2>
                        <p className="text-muted-foreground">{counselorProfile.qualifications}</p>
                        <div className="mt-2 text-sm text-primary font-semibold flex items-center justify-center md:justify-start">
                            <BadgeCheck className="h-5 w-5 mr-1.5"/> Verified Counselor
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center mb-3"><Briefcase className="w-5 h-5 mr-3 text-primary" /> Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {counselorProfile.specializations.map(spec => (
                        <Badge key={spec} variant="secondary" className="text-sm py-1 px-3">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">About Me</h3>
                    <p className="text-muted-foreground mt-1 leading-relaxed">{counselorProfile.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t">
                      <div>
                          <h4 className="font-semibold flex items-center"><Mail className="w-4 h-4 mr-2 text-primary" /> Email Address</h4>
                          <p className="text-muted-foreground mt-1">{counselorProfile.email}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold flex items-center"><Phone className="w-4 h-4 mr-2 text-primary" /> Phone Number</h4>
                          <p className="text-muted-foreground mt-1">{counselorProfile.phoneNumber || 'Not provided'}</p>
                      </div>
                  </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Contact Info</CardTitle>
                    <CardDescription>University contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold">University ID</h4>
                        <p className="text-muted-foreground">{counselorProfile.universityId}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Years of Experience</h4>
                        <p className="text-muted-foreground">{counselorProfile.yearsOfExperience} years</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Qualifications</CardTitle>
                    <CardDescription>Professional credentials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                   <p className="flex items-start gap-3"><Award className="h-5 w-5 mt-0.5 text-primary shrink-0"/> {counselorProfile.qualifications}</p>
                   <p className="flex items-start gap-3"><Star className="h-5 w-5 mt-0.5 text-primary shrink-0"/> {counselorProfile.specializations.join(', ')}</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
