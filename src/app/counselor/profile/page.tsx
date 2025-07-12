
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Edit3, BadgeCheck, Mail, Phone, Briefcase, Loader2 } from 'lucide-react';
import React from 'react';
import { useAuth, type UserProfile } from '@/contexts/AuthContext';

export default function CounselorProfilePage() {
  const { user, loading } = useAuth();
  // Placeholder data - in a real app, this would come from an API or session
  const counselorProfile = {
    fullName: user?.fullName || 'Counselor Name',
    email: user?.email || 'counselor@university.ac.uk',
    universityId: user?.universityId || 'COUNS0000',
    phoneNumber: '02012345678', // This would also come from DB
    bio: 'Experienced counselor specializing in cognitive behavioral therapy (CBT) and stress management. Dedicated to supporting student well-being and academic success.',
    avatarUrl: 'https://placehold.co/128x128.png',
    specializations: ['CBT', 'Stress Management', 'Anxiety Disorders', 'Student Mental Health'], // This would come from DB
    qualifications: 'PhD in Clinical Psychology, Licensed Professional Counselor (LPC)',
    yearsOfExperience: 10,
  };
  
  if (loading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserCircle className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline">Counselor Profile</h1>
        </div>
         <Button variant="outline" disabled> {/* Editing disabled for this example */}
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Profile (Coming Soon)
        </Button>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-primary/10 via-background to-background p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r">
            <Avatar className="h-40 w-40 mb-4 border-4 border-primary shadow-lg">
              <AvatarImage src={counselorProfile.avatarUrl} alt={counselorProfile.fullName} data-ai-hint="professional portrait" />
              <AvatarFallback className="text-5xl">{counselorProfile.fullName?.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold font-headline text-primary">{counselorProfile.fullName}</h2>
            <p className="text-muted-foreground">{counselorProfile.qualifications}</p>
            <div className="mt-2 text-sm text-accent flex items-center">
                <BadgeCheck className="h-4 w-4 mr-1"/> Verified Counselor
            </div>
          </div>

          <div className="md:w-2/3 p-8">
            <CardTitle className="text-2xl mb-6 border-b pb-4">Professional Information</CardTitle>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground flex items-center"><Briefcase className="w-4 h-4 mr-2 text-primary" /> Specializations</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {counselorProfile.specializations.map(spec => (
                    <span key={spec} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{spec}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                <p className="text-foreground mt-1 leading-relaxed">{counselorProfile.bio}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center"><Mail className="w-4 h-4 mr-2 text-primary" /> Email Address</h3>
                  <p className="text-foreground mt-1">{counselorProfile.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center"><Phone className="w-4 h-4 mr-2 text-primary" /> Phone Number</h3>
                  <p className="text-foreground mt-1">{counselorProfile.phoneNumber || 'Not provided'}</p>
                </div>
                 <div>
                  <h3 className="text-sm font-medium text-muted-foreground">University ID</h3>
                  <p className="text-foreground mt-1">{counselorProfile.universityId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Years of Experience</h3>
                  <p className="text-foreground mt-1">{counselorProfile.yearsOfExperience} years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
