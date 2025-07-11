
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
import { Textarea } from '@/components/ui/textarea';
import { AppointmentRequestSchema, type AppointmentRequestInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Loader2, RefreshCw, AlertTriangle, Users, MessageSquare, Video, User } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState, useEffect, useCallback } from 'react';
import { getCounselors, requestAppointment } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';

const allTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

export function RequestAppointmentForm() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [counselors, setCounselors] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingCounselors, setIsLoadingCounselors] = useState(true);
  const [counselorError, setCounselorError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);

  const form = useForm<AppointmentRequestInput>({
    resolver: zodResolver(AppointmentRequestSchema),
    defaultValues: {
      counselorId: '',
      reason: '',
      communicationMode: undefined,
      preferredTime: '',
    },
  });

  const selectedDate = form.watch('preferredDate');

  useEffect(() => {
    if (selectedDate) {
      setIsCheckingSlots(true);
      // Simulate fetching available slots for the selected date
      setTimeout(() => {
        // In a real app, this would be an API call.
        // Here, we just randomly filter some slots out to simulate availability.
        const randomSlots = allTimeSlots.filter(() => Math.random() > 0.3);
        setAvailableSlots(randomSlots);
        setIsCheckingSlots(false);
      }, 500);
    } else {
      setAvailableSlots([]);
    }
     // Reset preferred time when date changes
    form.setValue('preferredTime', '');
  }, [selectedDate, form]);


  const fetchCounselors = useCallback(async () => {
    if (authLoading) return;
    if (!user) {
      setCounselorError("You must be logged in to see available counselors.");
      setIsLoadingCounselors(false);
      return;
    }

    setIsLoadingCounselors(true);
    setCounselorError(null);
    const result = await getCounselors(user.uid);
    if ('error' in result) {
      setCounselorError(result.error);
    } else {
      setCounselors(result.data);
    }
    setIsLoadingCounselors(false);
  }, [user, authLoading]);

  useEffect(() => {
    fetchCounselors();
  }, [fetchCounselors]);

  async function onSubmit(values: AppointmentRequestInput) {
    if (!user || !user.fullName) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to request an appointment.',
      });
      return;
    }
    setIsSubmitting(true);
    const result = await requestAppointment(values, user.uid, user.fullName);
    
    if ('error' in result) {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: result.error,
        });
    } else {
        toast({
          title: 'Appointment Request Submitted',
          description: 'Your request has been sent. You will be notified once confirmed.',
        });
        form.reset();
        setAvailableSlots([]);
    }
    setIsSubmitting(false);
  }

  const isFormDisabled = authLoading || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        
        {/* Section 1: Scheduling */}
        <div className="space-y-6">
           <h3 className="text-lg font-medium text-foreground flex items-center"><CalendarIcon className="mr-3 h-5 w-5 text-primary" /> When would you like to meet?</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border rounded-lg bg-secondary/30">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Preferred Date</FormLabel>
                     <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal h-12 text-base",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isFormDisabled}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 mb-2">
                        Preferred Time
                        {isCheckingSlots && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>}
                    </FormLabel>
                    <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 gap-3"
                        disabled={isFormDisabled || !selectedDate || isCheckingSlots}
                      >
                         {availableSlots.length > 0 ? availableSlots.map(time => (
                           <FormItem key={time}>
                             <FormControl>
                                <RadioGroupItem value={time} id={time} className="sr-only" />
                             </FormControl>
                             <Label htmlFor={time} className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                               <Clock className="h-4 w-4" />
                               {time}
                             </Label>
                           </FormItem>
                         )) : (
                            <div className="col-span-2 text-center text-sm text-muted-foreground p-4 bg-muted/50 rounded-md">
                                {isCheckingSlots ? "Checking availability..." : "Please select a date to see available times."}
                            </div>
                         )}
                    </RadioGroup>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />
           </div>
        </div>

        <Separator />

        {/* Section 2: Details */}
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground flex items-center"><Users className="mr-3 h-5 w-5 text-primary" /> Session Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border rounded-lg bg-secondary/30">
                <FormField
                  control={form.control}
                  name="counselorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Counselor (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isFormDisabled || isLoadingCounselors || !!counselorError}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder={
                              authLoading ? "Verifying user..." :
                              isLoadingCounselors ? "Loading counselors..." :
                              "No preference"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="">No preference</SelectItem>
                          {counselors.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="communicationMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Communication Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormDisabled}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select how you'd like to meet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="video"><div className="flex items-center gap-2"><Video className="h-4 w-4"/> Video Call</div></SelectItem>
                          <SelectItem value="chat"><div className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Chat Session</div></SelectItem>
                          <SelectItem value="in-person"><div className="flex items-center gap-2"><User className="h-4 w-4"/> In-Person</div></SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="p-6 border rounded-lg bg-secondary/30">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Appointment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe what you'd like to discuss (e.g., stress, anxiety, academic pressure)."
                          className="resize-none"
                          rows={4}
                          {...field}
                          disabled={isFormDisabled}
                        />
                      </FormControl>
                      <FormDescription>
                        This information is confidential and helps your counselor prepare.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        {counselorError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Could Not Load Counselors</AlertTitle>
            <AlertDescription className="space-y-2">
              <p className="whitespace-pre-wrap">{counselorError}</p>
               <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={fetchCounselors} disabled={authLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting || authLoading || !!counselorError}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Submit Request'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
