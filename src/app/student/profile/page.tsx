
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProfileSchema, type ProfileInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Edit3, Loader2 } from 'lucide-react';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      universityId: '',
      phoneNumber: '',
      bio: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || '',
        email: user.email || '',
        universityId: user.universityId || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
      });
    }
  }, [user, form]);


  async function onSubmit(values: ProfileInput) {
    // In a real app, you would call an action to update the user profile
    console.log("Profile update submitted", values);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been saved.',
    });
    setIsEditing(false);
  }

  if (loading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!user) {
    return <div className="text-center text-muted-foreground">Please log in to view your profile.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences.</p>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          <Edit3 className="mr-2 h-4 w-4" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="overflow-hidden">
             <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center text-center">
                    <Avatar className="h-36 w-36 mb-4 border-4 border-primary/20 shadow-md">
                      <AvatarImage src={user.avatarUrl} alt={user.fullName || "User"} data-ai-hint="profile picture" />
                      <AvatarFallback className="text-5xl">{user.fullName?.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    {isEditing && <Button variant="ghost" size="sm" className="text-primary">Change Photo</Button>}
                    <h2 className="text-2xl font-bold mt-4">{user.fullName}</h2>
                    <p className="text-muted-foreground">{user.universityId}</p>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" {...field} disabled /></FormControl>
                          <FormDescription>Email cannot be changed.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input type="tel" {...field} disabled={!isEditing} placeholder="e.g., 020 123 4567" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell us a little about yourself (optional)" className="resize-none" rows={3} {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
             </CardContent>
             {isEditing && (
              <CardFooter className="border-t bg-muted/30 px-8 py-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}
