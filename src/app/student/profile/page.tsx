'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProfileSchema, type ProfileInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Edit3 } from 'lucide-react';
import React from 'react';

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);

  // Placeholder data - in a real app, this would come from session or API
  const currentUser = {
    fullName: 'Demo Student',
    email: 'demo.student@university.ac.uk',
    universityId: 'ATU00DEMO01',
    phoneNumber: '01234567890',
    bio: 'Computer Science student passionate about AI and mental well-being.',
    avatarUrl: 'https://placehold.co/128x128.png'
  };

  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: currentUser.fullName,
      email: currentUser.email,
      universityId: currentUser.universityId,
      phoneNumber: currentUser.phoneNumber || '',
      bio: currentUser.bio || '',
    },
  });

  async function onSubmit(values: ProfileInput) {
    setIsEditing(false);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(values);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been successfully updated.',
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserCircle className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline">My Profile</h1>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          <Edit3 className="mr-2 h-4 w-4" />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-primary/50 shadow-md">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.fullName} data-ai-hint="profile picture" />
              <AvatarFallback className="text-4xl">{currentUser.fullName?.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
            </Avatar>
           {isEditing && (
            <Button variant="ghost" size="sm" className="text-primary">
              Change Photo
            </Button>
           )}
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing} />
                      </FormControl>
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
                      <FormControl>
                        <Input type="email" {...field} disabled />
                      </FormControl>
                       <FormDescription>Email cannot be changed.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="universityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University ID</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormDescription>University ID cannot be changed.</FormDescription>
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
                      <FormControl>
                        <Input type="tel" {...field} disabled={!isEditing} placeholder="Optional" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself (optional)"
                        className="resize-none"
                        rows={3}
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            {isEditing && (
              <CardFooter className="border-t pt-6">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}
