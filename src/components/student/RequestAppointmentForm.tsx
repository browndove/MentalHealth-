
'use client';

import * as React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Calendar as CalendarIcon, Loader2, Video, MessageCircle, Users, AlertTriangle, Shield, CalendarHeart, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RequestAppointmentSchema, type RequestAppointmentInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createAppointment, getCounselors } from '@/lib/actions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { Input } from '../ui/input';

const availableTimes = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00",
];

export function RequestAppointmentForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [counselors, setCounselors] = useState<User[]>([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);

  useEffect(() => {
    async function fetchCounselors() {
      setLoadingCounselors(true);
      const result = await getCounselors();
      if (result.data) {
        setCounselors(result.data);
      } else if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load the list of counselors.',
        });
      }
      setLoadingCounselors(false);
    }
    fetchCounselors();
  }, [toast]);

  const form = useForm<RequestAppointmentInput>({
    resolver: zodResolver(RequestAppointmentSchema),
    defaultValues: {
      reason: '',
      contactMethod: 'video',
      counselorId: '',
      preferredTime: '',
      appointmentType: 'initial-consultation',
      priority: 'normal',
      referralSource: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  async function onSubmit(values: RequestAppointmentInput) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Not Authenticated', description: 'You must be logged in to book an appointment.' });
        return;
    }
    const result = await createAppointment(user.uid, values);

    if (result.success) {
      toast({
        title: 'Request Sent!',
        description: 'Your appointment request has been submitted. You will be notified once it is confirmed.',
      });
      form.reset();
      // Reset timezone after form reset
      form.setValue('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.error,
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {/* Section 1: Core Appointment Details */}
            <div className="md:col-span-2 space-y-8">
               <FormField
                  control={form.control}
                  name="counselorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Select a Counselor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingCounselors}>
                        <FormControl>
                          <SelectTrigger>
                            {loadingCounselors ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            <SelectValue placeholder="Choose a professional to speak with" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {counselors.map((c) => (
                            <SelectItem key={c.uid} value={c.uid}>{c.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>You can choose any available counselor.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-lg font-semibold">Preferred Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0,0,0,0)) 
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                         <FormDescription>Choose a date that works for you.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel className="text-lg font-semibold">Preferred Time</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableTimes.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                            </SelectContent>
                         </Select>
                          <FormDescription>All times are in your local timezone.</FormDescription>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
            </div>

            {/* Section 2: Type and Priority */}
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center gap-2"><CalendarHeart className="w-5 h-5" /> Appointment Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the type of appointment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="initial-consultation">Initial Consultation</SelectItem>
                          <SelectItem value="follow-up">Follow-up Session</SelectItem>
                          <SelectItem value="academic-support">Academic Support</SelectItem>
                           <SelectItem value="crisis-support">Crisis Support</SelectItem>
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem>
                           <label className="flex items-center gap-2 p-3 cursor-pointer border rounded-md has-[:checked]:bg-secondary has-[:checked]:border-primary transition-colors">
                            <FormControl><RadioGroupItem value="normal" /></FormControl>
                            <span className="font-medium">Normal</span>
                           </label>
                        </FormItem>
                        <FormItem>
                           <label className="flex items-center gap-2 p-3 cursor-pointer border rounded-md has-[:checked]:bg-secondary has-[:checked]:border-primary transition-colors">
                            <FormControl><RadioGroupItem value="urgent" /></FormControl>
                            <span className="font-medium">Urgent</span>
                           </label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Section 3: Communication and Referral */}
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="contactMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center gap-2"><Shield className="w-5 h-5" /> Meeting Preference</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How would you like to meet?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2"><Video className="w-4 h-4" /> Video Call</div>
                          </SelectItem>
                          <SelectItem value="chat">
                             <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Chat</div>
                          </SelectItem>
                          <SelectItem value="in-person">
                             <div className="flex items-center gap-2"><Users className="w-4 h-4" /> In-Person</div>
                          </SelectItem>
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referralSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Referral Source (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Professor, Friend, Poster" {...field} />
                    </FormControl>
                     <FormDescription>If someone referred you, please let us know.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
             {/* Section 4: Reason for Visit */}
            <div className="md:col-span-2 space-y-2">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Reason for Visit</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly tell us what you'd like to discuss. This helps the counselor prepare for your session. (e.g., feeling stressed about exams, relationship issues, etc.)"
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>This information is confidential and protected.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

          </CardContent>
          <CardFooter className="border-t bg-muted/30 px-8 py-4">
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              Submit Request
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
